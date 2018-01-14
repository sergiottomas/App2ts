import { PropostaMedicamento } from './../../providers/proposta-medicamento/proposta-medicamento';
import { PropostaAtualProvider } from './../../providers/proposta-atual/proposta-atual';
import { Proposta } from './../../providers/proposta/proposta';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PropostaAtual } from '../../providers/proposta-atual/proposta-atual';

@IonicPage()
@Component({
  selector: 'page-realizar-comparativo',
  templateUrl: 'realizar-comparativo.html',
})
export class RealizarComparativoPage {
  proposta: PropostaAtual;
  propostaMedicamento: PropostaMedicamento;

  constructor(public navCtrl: NavController, public navParams: NavParams, private propostaAtualProvider: PropostaAtualProvider) {
    this.propostaMedicamento = new PropostaMedicamento();
    this.proposta = new PropostaAtual();
    this.propostaMedicamento.medicamentosLaboratorios = [];
  }

  ionViewDidLoad() {
    this.getProposta();
  }

  getProposta() {
    console.log("oi");
    this.propostaAtualProvider.get()
      .then((result) => {
        this.proposta = result;
        this.proposta.qtdCiclos = 1;
        this.proposta.qtdPacientes = 1;
        this.proposta.usoPorPaciente = 1;
        console.log(this.proposta);
        this.deParaMedicamentosEMedicamentosProposta();
        console.log("xau");
      })
      .catch((e) => console.error(e));
    ;
  }

  deParaMedicamentosEMedicamentosProposta() {
    if (this.proposta != null)
      if (this.proposta.medicamento != null) {
        console.log("if");
        console.log(this.proposta.medicamento);
        
        this.propostaMedicamento = new PropostaMedicamento();
        console.log(this.propostaMedicamento.nome);
        this.propostaMedicamento.nome = this.proposta.medicamento.nome;
        this.propostaMedicamento.preco = this.proposta.medicamento.PF0;
        this.propostaMedicamento.precoDesconto = this.proposta.medicamento.PF0;
        this.propostaMedicamento.repasse = this.proposta.medicamento.PF0;
        this.propostaMedicamento.PF0 = this.proposta.medicamento.PF0;
        this.propostaMedicamento.PF12 = this.proposta.medicamento.PF12;
        this.propostaMedicamento.PF17 = this.proposta.medicamento.PF17;
        this.propostaMedicamento.PF17ALC = this.proposta.medicamento.PF17ALC;
        this.propostaMedicamento.PF175 = this.proposta.medicamento.PF175;
        this.propostaMedicamento.PF175ALC = this.proposta.medicamento.PF175ALC;
        this.propostaMedicamento.PF18 = this.proposta.medicamento.PF18;
        this.propostaMedicamento.PF18ALC = this.proposta.medicamento.PF18ALC;
        this.propostaMedicamento.PF20 = this.proposta.medicamento.PF20;
        this.propostaMedicamento.medicamentosLaboratorios = [];
        if (this.proposta.medicamento.laboratoriosMedicamento != null)
          this.proposta.medicamento.laboratoriosMedicamento.forEach(x => {
            var novaPropMed = new PropostaMedicamento();
            novaPropMed.nome = x.nome;
            novaPropMed.preco = x.PF0;
            novaPropMed.precoDesconto = x.PF0;
            novaPropMed.repasse = x.PF0;        
            novaPropMed.PF0 = x.PF0;
            novaPropMed.PF12 = x.PF12;
            novaPropMed.PF17 = x.PF17;
            novaPropMed.PF17ALC = x.PF17ALC;
            novaPropMed.PF175 = x.PF175;
            novaPropMed.PF175ALC = x.PF175ALC;
            novaPropMed.PF18 = x.PF18;
            novaPropMed.PF18ALC = x.PF18ALC;
            novaPropMed.PF20 = x.PF20;
            this.propostaMedicamento.medicamentosLaboratorios.push(novaPropMed);
          });
      }
  }

  realizarComparativo() {
    this.navCtrl.setRoot('RealizarComparativoPage', {}, {animate: true, direction: 'forward'});
    
  }
  selecionarProduto() {
    this.navCtrl.setRoot('SelecionarProdutoPage', {}, {animate: true, direction: 'forward'});    
  }

  irGraf() {
    this.navCtrl.setRoot('GraficoRentabilidadeAnualPage', {}, {animate: true, direction: 'forward'});    
  }

  selecionarClinica(){
    this.navCtrl.setRoot('SelecionarClinicaPage', {}, {animate: true, direction: 'forward'});    
  }

  calcularValor() {
    this.propostaMedicamento.precoDesconto =
      this.propostaMedicamento.precoDesconto -
      (this.propostaMedicamento.preco * (0.01 * this.propostaMedicamento.desconto));
  }

  calcularRepasse() {
    this.propostaMedicamento.repasse =
      (this.propostaMedicamento.preco * (0.01 * this.propostaMedicamento.porcentagemRepasse));
  }


  calcularRepasseMedicamento(obj) {
    obj.repasse =
      (obj.preco * (0.01 * obj.porcentagemRepasse));
  }

  calcularValorMedicamento(obj) {
    obj.precoDesconto =
      obj.preco -
      (obj.preco * (0.01 * obj.desconto));
  }

  irParaRentabilidade() {

    this.propostaMedicamento.rentabilidadeUnitaria = (this.propostaMedicamento.precoDesconto -
      
      this.propostaMedicamento.repasse);


    this.propostaMedicamento.rentabilidadePorPaciente =
      (this.proposta.qtdPacientes * this.proposta.usoPorPaciente) * this.propostaMedicamento.rentabilidadeUnitaria;

    this.propostaMedicamento.rentabilidadeAnual =
      this.propostaMedicamento.rentabilidadePorPaciente * this.proposta.qtdCiclos;

    this.propostaMedicamento.rentabilidadeMensal = 0;

    this.propostaMedicamento.medicamentosLaboratorios.forEach(x => {
      x.rentabilidadeUnitaria = x.precoDesconto  -
        x.repasse;

      x.rentabilidadePorPaciente =
        this.proposta.qtdPacientes * this.proposta.usoPorPaciente * x.rentabilidadeUnitaria;

      x.rentabilidadeAnual =
        x.rentabilidadePorPaciente * this.proposta.qtdCiclos;

      x.rentabilidadeMensal = 0;
    });

    this.proposta.medicamentoProposta = this.propostaMedicamento;

    this.propostaAtualProvider.update(this.proposta);
    
    this.navCtrl.push('ExibirRentabilidadePage');
  }
}
