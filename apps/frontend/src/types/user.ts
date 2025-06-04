export type UserData = AnonymousUserData | IdentifiableUserData;

export type AnonymousUserData = {
  anonymous: true;
  id: string;
};

export type IdentifiableUserData = {
  anonymous: false;
  id: string;
  name: string;
  email: string;
  age: string;
}
