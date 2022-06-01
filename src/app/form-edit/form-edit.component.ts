import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.scss'],
})
export class FormEditComponent implements OnInit {
  @ViewChild('editForm') editForm: FormGroupDirective;
  @Input() id: any;

  editContactForm: FormGroup;
  suscribe1: Subscription;
  suscribe2: Subscription;
  contact: any;
  isEdited = false;

  constructor(
    private modalController: ModalController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.suscribe1 = this.dataService
      .getContactById(this.id)
      .subscribe((contact) => {
        if (!contact) {
          this.close();
        } else {
          //editar el contacto
          this.contact = contact;
          this.editContactForm = new FormGroup({
            name: new FormControl(this.contact.name, Validators.required),
            lastname: new FormControl(
              this.contact.lastname,
              Validators.required
            ),
            email: new FormControl(this.contact.email, Validators.required),
            mobile: new FormControl(this.contact.mobile, Validators.required),
          });

          this.suscribe2 = this.editContactForm.valueChanges.subscribe(
            (values) => {
              this.isEdited = true;
            }
          );
        }
      });
  }

  submitForm() {
    this.editForm.onSubmit(undefined);
  }

  editContact(value: any) {
    const editedContact = { id: this.contact.id, ...value };
    console.log('Contacto modificado');
    this.dataService.editContact(editedContact).then((res) => this.close);
  }

  close() {
    this.modalController.dismiss();
  }
}
