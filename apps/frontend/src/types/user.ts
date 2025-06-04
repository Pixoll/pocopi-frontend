export type UserData = AnonymousUserData | IdentifiableUserData;

export type AnonymousUserData = {
  anonymous: true; // no dar
  id: string;
};

export type IdentifiableUserData = {
  anonymous: false; // no dar
  id: string;
  name: string;
  email: string;
  age: string;
}
