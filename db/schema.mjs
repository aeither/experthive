export const POLYBASE_SCHEMA = `
@public
collection User {
  id: string;
  publicKey: PublicKey;
  encryptPubKey?: string;
  name?: string; 

  constructor (id: string) {
    this.id = id;
    
    this.publicKey = ctx.publicKey;
    this.name = 'anonymous';
  }

  function setName (name: string) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.name = name;
  }

  function setEncryptPubKey (encryptPubKey: string) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.encryptPubKey = encryptPubKey;
  }
  
  del(){
    if (ctx.publicKey != this.publicKey) {
      error('You are not the owner');
    }
    selfdestruct();
  }

  @index(id);
}

@public
collection Call {  
  id: string;
  title: string;
  description: string;
  date: string;
  expert: string;
  participant: string;
  room: string;
  status: string;

  constructor (id: string, title: string, description: string, date: string, expert: string, participant: string, room: string, status: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
    this.expert = expert;
    this.participant = participant;
    this.room = room;
    this.status = status;
  }

  @index([date, desc]);
}
`;
