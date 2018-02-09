export class AuthStatus {
  constructor(public isConnected: boolean, public userName: string) {

  }
}

export enum PolicyType {
  SignIn = 1,
  Register = 2
}
