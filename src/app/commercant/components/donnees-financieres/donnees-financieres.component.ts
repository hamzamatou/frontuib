import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type DonneesFinancieresPrefill = {
  ancienneteEmploiMois?: number;
  revenu?: number;
  autresRevenus?: number;
  loyer?: number;
  mensualitesCredits?: number;
  autresChargesFixes?: number;
  credits?: number;
};

@Component({
  selector: 'app-donnees-financieres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donnees-financieres.component.html',
  styleUrls: ['./donnees-financieres.component.css']
})
export class DonneesFinancieresComponent implements OnChanges {
  @Input() status: 'active' | 'completed' | 'pending' = 'pending';

  // Pré-remplissage automatique des champs liés au dossier financier
  @Input() prefill: DonneesFinancieresPrefill | null = null;

  ancienneteEmploiMois!: number;
  revenu!: number;
  autresRevenus!: number;
  loyer!: number;
  mensualitesCredits!: number;
  autresChargesFixes!: number;
  credits!: number;

  // Champs propres à la demande
  montant!: number;
  dureeMois!: number;
  objet!: string;

  formError = '';
  ancienneteError = '';
  revenuError = '';
  autresRevenusError = '';
  loyerError = '';
  mensualitesCreditsError = '';
  autresChargesFixesError = '';
  creditsError = '';
  montantError = '';

  @Output() nextStep = new EventEmitter<any>();
  @Output() prevStep = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prefill'] && this.prefill) {
      const p = this.prefill;
      if (p.ancienneteEmploiMois !== undefined) this.ancienneteEmploiMois = p.ancienneteEmploiMois;
      if (p.revenu !== undefined) this.revenu = p.revenu;
      if (p.autresRevenus !== undefined) this.autresRevenus = p.autresRevenus;
      if (p.loyer !== undefined) this.loyer = p.loyer;
      if (p.mensualitesCredits !== undefined) this.mensualitesCredits = p.mensualitesCredits;
      if (p.autresChargesFixes !== undefined) this.autresChargesFixes = p.autresChargesFixes;
      if (p.credits !== undefined) this.credits = p.credits;
    }
  }

  next() {
    this.formError = '';
    this.ancienneteError = '';
    this.revenuError = '';
    this.autresRevenusError = '';
    this.loyerError = '';
    this.mensualitesCreditsError = '';
    this.autresChargesFixesError = '';
    this.creditsError = '';
    this.montantError = '';

    const isFiniteNumber = (v: any): boolean =>
      v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v));

    const requireField = (v: any, setError: (msg: string) => void, msg: string) => {
      if (!isFiniteNumber(v)) setError(msg);
    };

    requireField(this.ancienneteEmploiMois, (m) => (this.ancienneteError = m), 'Champ obligatoire.');
    requireField(this.revenu, (m) => (this.revenuError = m), 'Champ obligatoire.');
    requireField(this.loyer, (m) => (this.loyerError = m), 'Champ obligatoire.');
    requireField(this.mensualitesCredits, (m) => (this.mensualitesCreditsError = m), 'Champ obligatoire.');
    requireField(this.autresChargesFixes, (m) => (this.autresChargesFixesError = m), 'Champ obligatoire.');
    requireField(this.credits, (m) => (this.creditsError = m), 'Champ obligatoire.');
    requireField(this.montant, (m) => (this.montantError = m), 'Champ obligatoire.');

    if (!this.objet || !this.objet.trim()) {
      this.formError = 'Veuillez remplir les champs obligatoires.';
    }

    const toNum = (v: any): number => Number(v);

    if (isFiniteNumber(this.ancienneteEmploiMois) && toNum(this.ancienneteEmploiMois) < 0) {
      this.ancienneteError = 'Doit être >= 0.';
    }
    if (isFiniteNumber(this.revenu) && toNum(this.revenu) < 0) {
      this.revenuError = 'Doit être >= 0.';
    }
    if (isFiniteNumber(this.autresRevenus) && toNum(this.autresRevenus) < 0) {
      this.autresRevenusError = 'Doit être >= 0.';
    }
    if (isFiniteNumber(this.loyer) && toNum(this.loyer) < 0) {
      this.loyerError = 'Doit être >= 0.';
    }
    if (isFiniteNumber(this.mensualitesCredits) && toNum(this.mensualitesCredits) < 0) {
      this.mensualitesCreditsError = 'Doit être >= 0.';
    }
    if (isFiniteNumber(this.autresChargesFixes) && toNum(this.autresChargesFixes) < 0) {
      this.autresChargesFixesError = 'Doit être >= 0.';
    }
    if (isFiniteNumber(this.credits) && toNum(this.credits) < 0) {
      this.creditsError = 'Doit être >= 0.';
    }
    if (isFiniteNumber(this.montant) && toNum(this.montant) < 0) {
      this.montantError = 'Doit être >= 0.';
    }

    const hasAnyError =
      !!this.ancienneteError ||
      !!this.revenuError ||
      !!this.autresRevenusError ||
      !!this.loyerError ||
      !!this.mensualitesCreditsError ||
      !!this.autresChargesFixesError ||
      !!this.creditsError ||
      !!this.montantError ||
      !!this.formError;

    if (hasAnyError) return;

    // Règle : somme des charges > revenu total => erreur
    const revenuTotal = toNum(this.revenu) + (isFiniteNumber(this.autresRevenus) ? toNum(this.autresRevenus) : 0);
    const chargesMensuelles = toNum(this.loyer) + toNum(this.mensualitesCredits) + toNum(this.autresChargesFixes);
    if (chargesMensuelles > revenuTotal) {
      this.formError = 'La somme des charges mensuelles ne doit pas dépasser le revenu mensuel.';
      return;
    }

    const duree = Number(this.dureeMois);
    if (!Number.isFinite(duree) || duree < 0) {
      this.formError = 'Durée invalide.';
      return;
    }

    this.nextStep.emit({
      ancienneteEmploiMois: toNum(this.ancienneteEmploiMois),
      revenu: toNum(this.revenu),
      autresRevenus: isFiniteNumber(this.autresRevenus) ? toNum(this.autresRevenus) : 0,
      loyer: toNum(this.loyer),
      mensualitesCredits: toNum(this.mensualitesCredits),
      autresChargesFixes: toNum(this.autresChargesFixes),
      credits: toNum(this.credits),
      montant: toNum(this.montant),
      dureeMois: duree,
      objet: this.objet.trim()
    });
  }

  prev() { this.prevStep.emit(); }
}