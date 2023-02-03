import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server

  constructor (
    private readonly jwtService: JwtService,
    private readonly messagesWsService: MessagesWsService
  ) {}

  async handleConnection(client: Socket, ...args: Socket[]) {
    const token = client.handshake.headers.authorization as string
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify(token)
      await this.messagesWsService.registerClient(client, payload.id)
    } catch (error: any) {
      client.disconnect()
      return
    }
    // console.log({ payload })
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedCountClients())
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedCountClients())
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emitir unicamente al cliente en cuestión
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'No message'
    // })

    //! Emitir a todos los clientes menos al emisor
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'No message'
    // })

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'No message'
    })
  }

}
