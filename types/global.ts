export interface Credentials {
    email: string
    password: string
  }

export  interface UserProfile {
  username: string,
  firstname: string,
  lastname: string
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
  end: string
}

export interface EventEditionRequest {
  mode: 'create' | 'edit' | 'delete'
  type: 'event' | 'opening_hour'
  id?: string
  event?: BasicEvent | BasicOpeningHour
}