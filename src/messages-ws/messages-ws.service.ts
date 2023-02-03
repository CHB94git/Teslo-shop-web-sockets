import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Socket } from 'socket.io';
import { AuthUser } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket,
    user: AuthUser
  }
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {}

  constructor (
    @InjectRepository(AuthUser)
    private readonly userRepository: Repository<AuthUser>
  ) {}

  async registerClient(client: Socket, userId: string) {
    const userDB = await this.userRepository.findOneBy({ id: userId })
    if (!userDB) throw new Error('User not found')
    if (!userDB.isActive) throw new Error('User not active')

    this.checkUserConnection(userDB)

    this.connectedClients[client.id] = {
      socket: client,
      user: userDB
    }
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId]
  }

  getConnectedCountClients(): Array<string> {
    return Object.keys(this.connectedClients)
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName
  }

  private checkUserConnection(user: AuthUser) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId]

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect()
        break
      }
    }
  }
}
