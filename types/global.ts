export interface Credentials {
    email: string
    password: string
  }

export  interface UserProfile {
  id: string,
  username: string,
  firstname: string,
  lastname: string
}

export interface BasicUser {
  id: string,
  username: string
}

export interface BasicEvent {
  name: string,
  date: Date,
  start: string,
  end: string,
  description?: string
}

export interface BasicOpeningHour{
  date: Date,
  start: string,
  end: string,
  organizer: BasicUser
}

export interface EventEditionRequest {
  mode: 'create' | 'edit' | 'delete'
  type: 'event' | 'opening_hour'
  id?: string
  event?: BasicEvent | BasicOpeningHour,
  tables?: Array<string>
}