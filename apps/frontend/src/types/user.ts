export type UserData = AnonymousUserData | IdentifiableUserData;

export type AnonymousUserData = {
  anonymous: true;
  id: string;
  group: string;
};

export type IdentifiableUserData = {
  anonymous: false;
  id: string;
  group: string;
  name: string;
  email: string;
  age: number;
}
