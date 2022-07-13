import * as React from 'react';
import styles from './LaboratorioCalibracaoEditarInstrumentos.module.scss';
import { ILaboratorioCalibracaoEditarInstrumentosProps } from './ILaboratorioCalibracaoEditarInstrumentosProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jQuery from "jquery";
import { allowOverscrollOnElement, DatePicker } from 'office-ui-fabric-react';
import { Web } from 'sp-pnp-js';
import "bootstrap";
import { UrlQueryParameterCollection, Version } from '@microsoft/sp-core-library';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;
var _idInstrumento;

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


export default class LaboratorioCalibracaoEditarInstrumentos extends React.Component<ILaboratorioCalibracaoEditarInstrumentosProps, IReactGetItemsState> {

  public componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);

    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _idInstrumento = parseInt(queryParms.getValue("InstrumentoID"));

    this.handler();


  }

  public constructor(props: ILaboratorioCalibracaoEditarInstrumentosProps, state: IReactGetItemsState) {
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

  public render(): React.ReactElement<ILaboratorioCalibracaoEditarInstrumentosProps> {
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
          <select id="ddlFilial"  className="form-control" style={{ "width": "300px" }}>
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
          <button id="btnConfirmarCriarInstrumento" className="btn btn-success" >Editar Instrumento</button>
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


    this.getInstrumento();

  }

  private onFormatDate = (date: Date): string => {
    //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  }


  protected getInstrumento() {

    console.log("entrou no proposta");

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Instrumento')/items?$select=ID,Title,Fabricante/ID,Modelo,Resolucao,Descricao,Filial/ID,NumeroDeSerie,TipoDeInstrumento/ID,nrCertificado,DataAfericao&$expand=Fabricante,Filial,TipoDeInstrumento&$filter=ID eq ` + _idInstrumento,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      async: false,
      success: async (resultData) => {

        console.log("resultData Proposta", resultData);

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var cac = resultData.d.results[i].Title;
            var modelo = resultData.d.results[i].Modelo;
            var resolucao = resultData.d.results[i].Resolucao;
            var descricao = resultData.d.results[i].Descricao;

            jQuery("#txtCAC").val(cac);
            jQuery("#txtModelo").val(modelo);
            jQuery("#txtResolucao").val(resolucao);
            jQuery("#txtDescricao").val(descricao);

            var dataEntregaPropostaCliente = resultData.d.results[i].DataEntregaPropostaCliente;
            var dataFinalQuestionamentos = resultData.d.results[i].DataFinalQuestionamentos;
            var dataValidadeProposta = resultData.d.results[i].DataValidadeProposta;
/*
            this.setState({
              valorItemsRepresentante: resultData.d.results[i].Representante.ID,
              valorItemsCliente: resultData.d.results[i].Cliente.ID,
            });

            var itemsResponsavelProposta = resultData.d.results[i].ResponsavelProposta;

            if (itemsResponsavelProposta == null) {

              this.setState({
                valorItemsResponsavelProposta: 0
              });

            } else {

              this.setState({
                valorItemsResponsavelProposta: resultData.d.results[i].ResponsavelProposta
              });


            }

*/
          }

        }

        //console.log("_arrProdutoZ", _arrProduto);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    })

  }
}
