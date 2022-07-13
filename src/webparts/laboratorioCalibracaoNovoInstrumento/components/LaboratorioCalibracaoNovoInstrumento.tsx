import * as React from 'react';
import styles from './LaboratorioCalibracaoNovoInstrumento.module.scss';
import { ILaboratorioCalibracaoNovoInstrumentoProps } from './ILaboratorioCalibracaoNovoInstrumentoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jQuery from "jquery";
import { allowOverscrollOnElement, DatePicker } from 'office-ui-fabric-react';
import { Web } from 'sp-pnp-js';
import "bootstrap";

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;

export interface IReactGetItemsState {
  itemsFabricante: [
    {
      "ID": any,
      "Title": any,
    }],
  itemsFilial: [
    {
      "ID": any,
      "Title": any,
    }],
  itemsTipoInstrumento: [
    {
      "ID": any,
      "Title": any,
    }],

}

export default class LaboratorioCalibracaoNovoInstrumento extends React.Component<ILaboratorioCalibracaoNovoInstrumentoProps, IReactGetItemsState> {

  public componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);

    document
      .getElementById("btnConfirmarCriarInstrumento")
      .addEventListener("click", (e: Event) => this.modalConfirmar());

    document
      .getElementById("btnCriarInstrumento")
      .addEventListener("click", (e: Event) => this.criarInstrumento());

    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso());

    this.handler();


  }

  public constructor(props: ILaboratorioCalibracaoNovoInstrumentoProps, state: IReactGetItemsState) {
    super(props);
    this.state = {
      itemsFabricante: [
        {
          "ID": "",
          "Title": "",
        }],
      itemsFilial: [
        {
          "ID": "",
          "Title": "",
        }],
      itemsTipoInstrumento: [
        {
          "ID": "",
          "Title": "",
        }],

    };
  }


  public render(): React.ReactElement<ILaboratorioCalibracaoNovoInstrumentoProps> {


    return (

      <><div id="container">

        <div className="form-group">
          <label htmlFor="txtCAC">CAC</label><span className="required"> *</span>
          <input style={{ "width": "300px" }} type="number" className="form-control" id="txtCAC" />
        </div>

        <div className="form-group">
          <label htmlFor="ddlFabricante">Fabricante</label>
          <select id="ddlFabricante" className="form-control" style={{ "width": "300px" }}>
            <option value="0" selected>Selecione...</option>
            {this.state.itemsFabricante.map(function (item, key) {
              return (
                <option value={item.ID}>{item.Title}</option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="txtModelo">Modelo</label>
          <input type="text" className="form-control" id="txtModelo" />
        </div>

        <div className="form-group">
          <label htmlFor="txtResolucao">Resolução</label>
          <input type="text" className="form-control" id="txtResolucao" />
        </div>

        <div className="form-group">
          <label htmlFor="txtDescricao">Descrição</label>
          <textarea id='txtDescricao' className="form-control" rows={3} required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="ddlFilial">Enviar para filial</label>
          <select id="ddlFilial" className="form-control" style={{ "width": "300px" }}>
            <option value="0" selected>Selecione...</option>
            {this.state.itemsFilial.map(function (item, key) {
              return (
                <option value={item.ID}>{item.Title}</option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="txtNumeroSerie">Número de série</label>
          <input style={{ "width": "300px" }} type="number" className="form-control" id="txtNumeroSerie" />
        </div>

        <div className="form-group">
          <label htmlFor="ddlTipoInstrumento">Tipo de instrumento</label>
          <select id="ddlTipoInstrumento" className="form-control" style={{ "width": "300px" }}>
            <option value="0" selected>Selecione...</option>
            {this.state.itemsTipoInstrumento.map(function (item, key) {
              return (
                <option value={item.ID}>{item.Title}</option>
              );
            })}
          </select>
        </div>

        <div className="form-group certificado">
          <label htmlFor="nroNumeroCertificado">Número do Certificado</label>
          <input type="number" style={{ "width": "300px" }} className="form-control" id="nroNumeroCertificado" />
        </div>

        <div className="form-group certificado">
          <label htmlFor="dtDataAfericao">Data de aferição</label>
          <DatePicker style={{ "width": "300px" }} minDate={new Date()} formatDate={this.onFormatDate} isMonthPickerVisible={false} className="datePicker" id='dtDataAfericao' />
        </div>

        <div className="form-group certificado">
          <label htmlFor="nroDiasProximaAfericao">Dias para próxima aferição</label>
          <input type="text" style={{ "width": "300px" }} className="form-control" id="nroDiasProximaAfericao" />
        </div>

        <br></br>

        <div className="text-right">
          <button id="btnConfirmarCriarInstrumento" className="btn btn-success" >Criar Instrumento</button>
        </div>


      </div>


        <div className="modal fade" id="modalSucesso" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Instrumento cadastrado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucesso" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalConfirmar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente criar o Instrumento?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCriarInstrumento" type="button" className="btn btn-primary">Criar</button>
              </div>
            </div>
          </div>
        </div>

      </>


    );
  }

  protected handler() {


    var reactHandlerFabricante = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Fabricante')/items?$top=50&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandlerFabricante.setState({
          itemsFabricante: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactHandlerFilial = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Filial')/items?$top=50&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandlerFilial.setState({
          itemsFilial: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactHandlerTipoInstrumento = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('TipoDeInstrumento')/items?$top=50&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandlerTipoInstrumento.setState({
          itemsTipoInstrumento: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });



  }

  private onFormatDate = (date: Date): string => {
    //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  }


  protected modalConfirmar() {

    var cac = jQuery("#txtCAC").val();

    if (cac == "") {

      alert("Forneça o CAC");
      return false;

    } else {

      jQuery.ajax({

        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Instrumento')/items?$top=1&$select=ID,Title&$filter=Title eq '` + cac + `'`,
        type: "GET",
        async: false,
        headers: { 'Accept': 'application/json; odata=verbose;' },
        success: async (resultData) => {

          if (resultData.d.results.length > 0) {

            alert("Já existe um CAC com esse número!");
            return false;

          } else {

            jQuery("#modalConfirmar").modal({ backdrop: 'static', keyboard: false });


          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });


    }


  }


  protected async criarInstrumento() {

    jQuery("#btnCriarInstrumento").prop("disabled", true);

    var cac = jQuery("#txtCAC").val();
    var fabricante = jQuery("#ddlFabricante").val();
    if(fabricante == 0) fabricante = null;
    var modelo = jQuery("#txtModelo").val();
    var resolucao = jQuery("#txtResolucao").val();
    var descricao = jQuery("#txtDescricao").val();

    var filial = jQuery("#ddlFilial").val();
    if(filial == 0) filial = null;

    var numeroSerie = jQuery("#txtNumeroSerie").val();
    var tipoInstrumento = jQuery("#ddlTipoInstrumento").val();
    if(tipoInstrumento == 0) tipoInstrumento = null;
    var numeroCertificado = jQuery("#nroNumeroCertificado").val();
    var diasProximaAfericao = jQuery("#nroDiasProximaAfericao").val();
    if(diasProximaAfericao == "") diasProximaAfericao = null;

    var dataAfericao = "" + jQuery("#dtDataAfericao-label").val() + "";
    var dataAfericaoDia = dataAfericao.substring(0, 2);
    var dataAfericaoMes = dataAfericao.substring(3, 5);
    var dataAfericaoAno = dataAfericao.substring(6, 10);
    var formdataAfericao = dataAfericaoAno + "-" + dataAfericaoMes + "-" + dataAfericaoDia;

    if (dataAfericao == "") formdataAfericao = null;

    var numero = jQuery("#txtNumero").val();

    await _web.lists
      .getByTitle("Instrumento")
      .items.add({
        Title: cac,
        FabricanteId: fabricante,
        Modelo: modelo,
        Resolucao: resolucao,
        Descricao: descricao,
        FilialId: filial,
        NumeroDeSerie: numeroSerie,
        TipoDeInstrumentoId: tipoInstrumento,
        nrCertificado: numeroCertificado,
        DataAfericao: formdataAfericao,
        //DiasProximaAfericao: diasProximaAfericao,
      })
      .then(async response => {

        console.log("gravou!!");
        jQuery("#modalConfirmar").modal('hide');
        jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

      })
      .catch((error: any) => {
        console.log(error);

      })

  }

  protected fecharSucesso() {

    jQuery("#modalSucesso").modal('hide');
    window.location.href = `Instrumentos.aspx`;

  }


}
