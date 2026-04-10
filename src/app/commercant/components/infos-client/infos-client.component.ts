import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-infos-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './infos-client.component.html',
  styleUrls: ['./infos-client.component.css']
})
export class InfosClientComponent {
  @Input() status: 'active' | 'completed' | 'pending' = 'active';

  // Tous les champs obligatoires du client
  nom: string = '';
  prenom: string = '';
  email: string = '';
  telephone: string = '';
  cin: string = '';
  adresse: string = '';
  sexe: string = '';
  profession: string = '';
  employeur: string = '';

  formError = '';
  telephoneError = '';
  cinError = '';

  @Output() nextStep = new EventEmitter<any>();

  next() {
    this.formError = '';
    this.telephoneError = '';
    this.cinError = '';

    const requiredMissing =
      !this.nom.trim() ||
      !this.prenom.trim() ||
      !this.email.trim() ||
      !this.telephone.trim() ||
      !this.cin.trim() ||
      !this.adresse.trim() ||
      !this.sexe.trim() ||
      !this.profession.trim() ||
      !this.employeur.trim();

    if (requiredMissing) {
      this.formError = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const cinDigits = this.cin.trim();
    if (!/^\d{8}$/.test(cinDigits)) {
      this.cinError = 'Le CIN doit contenir exactement 8 chiffres.';
      return;
    }

    const telDigits = this.telephone.trim();
    if (!/^\d{8}$/.test(telDigits)) {
      this.telephoneError = 'Le téléphone doit contenir exactement 8 chiffres.';
      return;
    }

    // On émet toutes les données au parent
    this.nextStep.emit({
      nom: this.nom.trim(),
      prenom: this.prenom.trim(),
      email: this.email.trim(),
      telephone: this.telephone.trim(),
      cin: this.cin.trim(),
      adresse: this.adresse.trim(),
      sexe: this.sexe.trim(),
      profession: this.profession.trim(),
      employeur: this.employeur.trim()
    });

    // Marquer comme complété
    this.status = 'completed';
  }
}