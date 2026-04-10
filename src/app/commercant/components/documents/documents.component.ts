import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentMultipart } from '../../../services/demande.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {

  @Input() status: 'pending' | 'active' | 'completed' = 'pending';
  @Output() nextStep = new EventEmitter<{documents: DocumentMultipart[], typeProduit: string}>();
  @Output() prevStep = new EventEmitter<void>();

  uploadedFiles: DocumentMultipart[] = [];
  typeProduit: string = 'BNPL'; // ou récupéré dynamiquement si besoin

  // Taille max par fichier
  readonly MAX_SIZE = 10 * 1024 * 1024; // 10MB

  // Gestion des fichiers uploadés
  onFile(event: any, typeDocument: string) {
    const file: File = event.target.files[0];
    if (!file) return;

    if (file.size > this.MAX_SIZE) {
      alert(`Le fichier ${file.name} dépasse la taille maximale de 10MB !`);
      return;
    }

    const existingIndex = this.uploadedFiles.findIndex(f => f.typeDocument === typeDocument);
    if (existingIndex !== -1) {
      this.uploadedFiles[existingIndex] = { typeDocument, file };
    } else {
      this.uploadedFiles.push({ typeDocument, file });
    }
  }

  // Bouton Suivant
  goNext() {
    if (this.uploadedFiles.length === 0) {
      alert('Veuillez uploader au moins un document !');
      return;
    }

    // Filtrer par sécurité au cas où un fichier trop gros aurait été ajouté
    const validDocs = this.uploadedFiles.filter(d => d.file.size <= this.MAX_SIZE);
    if (validDocs.length < this.uploadedFiles.length) {
      alert("Certains fichiers dépassent 10MB et ne seront pas envoyés !");
    }

    this.nextStep.emit({ documents: validDocs, typeProduit: this.typeProduit });
  }
}