import { requireProperty, ID } from './utils'

export enum ActionTypeV1 {
  GET = 'GET',
  SET = 'SET',
  ACTION = 'ACTION'
}

export enum CommunicationMethodV1 {
  JSONRPC = 'JSONRPC',
  SERIAL = 'SERIAL'
}

export type ActionObjectInformationV1 = {
  uri: string
  actionType: ActionTypeV1
  path: string[]
  modifyingValue: any
  commMethod: CommunicationMethodV1
  response: undefined | string
}

class ActionObjectV1 {
  information: ActionObjectInformationV1
  id: string

  constructor(information: ActionObjectInformationV1, id = ID()) {
    this.information = information
    this.id = id
  }

  serialize() {
    return JSON.stringify({
      ...this.information,
      id: this.id
    })
  }
}

export const v1 = {
  create(information: ActionObjectInformationV1, optionalID?: string) {
    return new ActionObjectV1(information, optionalID)
  },
  deserialize(rawString: string) {
    const rawJson = JSON.parse(rawString)
    const uri = requireProperty(rawJson, 'uri')
    const actionType = requireProperty(rawJson, 'actionType', value => {
      return Object.keys(ActionTypeV1).includes(value)
    }) as ActionTypeV1
    const path = requireProperty(rawJson, 'path', value => {
      const isArray = Array.isArray(value)
      if (!isArray) {
        return false
      }
      for (let index = 0; index < value.length; index++) {
        const element = value[index]
        if (typeof element !== 'string') {
          return false
        }
      }
      return true
    }) as string[]
    const modifyingValue = requireProperty(rawJson, 'modifyingValue')
    const commMethod = requireProperty(rawJson, 'commMethod', value => {
      return Object.keys(CommunicationMethodV1).includes(value)
    }) as CommunicationMethodV1
    const response = rawJson['response']
    const id = requireProperty(rawJson, 'id')

    return new ActionObjectV1(
      {
        uri,
        actionType,
        path,
        modifyingValue,
        commMethod,
        response
      },
      id
    )
  }
}
