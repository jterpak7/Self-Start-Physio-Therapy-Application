import { Injectable } from '@angular/core';
import * as crypto from "crypto-browserify";

@Injectable()
export class EncryptionService {

  constructor() {
   }

  hash(text){
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
  }

  encrypt(plainText){
    var cipher = crypto.createCipher('aes256', 'sammallabone');
    var crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
  }

  decrypt(cipherText){
    var decipher = crypto.createDecipher('aes256', 'sammallabone');
    var dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
  }

  GenSalt() {
    return crypto.randomBytes(16).toString('base64');
  }
}
