import { Injectable } from '@angular/core';
import {
  collectionData,
  docSnapshots,
  Firestore,
} from '@angular/fire/firestore';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: Firestore) {}

  //Crea un contacto
  createContact(contact: any) {
    const document = doc(collection(this.firestore, 'contacts'));
    return setDoc(document, contact);
  }

  //Obtiene todos los contactos
  getContacts(): Observable<any[]> {
    const contactsCollection = collection(this.firestore, 'contacts');
    return collectionData(contactsCollection, { idField: 'id' }).pipe(
      map((contacts) => contacts as any[])
    );
  }

  //Obtiene un contacto especifico
  getContactById(id: string): Observable<any[]> {
    const document = doc(this.firestore, `contacts/${id}`);
    return docSnapshots(document).pipe(
      map((record: any) => {
        const data = record.data();
        return { id: record?.id, ...data } as any;
      })
    );
  }

  //Actualiza un contacto especifico
  editContact(contact: any) {
    const document = doc(this.firestore, 'contacts', contact?.id);
    const { id, ...data } = contact;
    return setDoc(document, data);
  }

  //Elimina un contacto especifico
  removeContact(id: string) {
    const document = doc(this.firestore, 'contacts', id);
    return deleteDoc(document);
  }
}
