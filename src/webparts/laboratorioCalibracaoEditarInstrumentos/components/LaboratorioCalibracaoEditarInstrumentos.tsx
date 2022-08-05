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
var _dataAfericao;
var _valorCacAntigo;

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
  valorItemsFabricante: "",
  valorItemsEnviarFilial: "",
  valorItemsTipoInstrumento: "",

}


export default class LaboratorioCalibracaoEditarInstrumentos extends React.Component<ILaboratorioCalibracaoEditarInstrumentosProps, IReactGetItemsState> {

  public componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);

    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _idInstrumento = parseInt(queryParms.getValue("InstrumentoID"));

    document
      .getElementById("btnConfirmarCriarInstrumento")
      .addEventListener("click", (e: Event) => this.modalConfirmar());

    document
      .getElementById("btnEditarInstrumento")
      .addEventListener("click", (e: Event) => this.salvar());

    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso());



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
      valorItemsFabricante: "",
      valorItemsEnviarFilial: "",
      valorItemsTipoInstrumento: "",


    };
  }

  public render(): React.ReactElement<ILaboratorioCalibracaoEditarInstrumentosProps> {
    return (


      <><div id="container">

        <div className="form-group">
          <label htmlFor="txtCAC">CAC</label><span className="required"> *</span><br></br>
          <span className='text-info' id="txtCAC"></span>
        </div>

        <div className="form-group">
          <label htmlFor="ddlFabricante">Fabricante</label>
          <select id="ddlFabricante" value={this.state.valorItemsFabricante} className="form-control" style={{ "width": "300px" }} onChange={(e) => this.onChangeFabricante(e.target.value)}>
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
          <label htmlFor="ddlFilial">Enviar para filial</label>
          <select id="ddlFilial" value={this.state.valorItemsEnviarFilial} className="form-control" style={{ "width": "300px" }} onChange={(e) => this.onChangeEnviarFilial(e.target.value)}>
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
          <select id="ddlTipoInstrumento" value={this.state.valorItemsTipoInstrumento} className="form-control" style={{ "width": "300px" }} onChange={(e) => this.onChangeTipoInstrumento(e.target.value)}>
            <option value="0" selected>Selecione...</option>
            {this.state.itemsTipoInstrumento.map(function (item, key) {
              return (
                <option value={item.ID}>{item.Title}</option>

              );
            })}
          </select>
        </div>

        <br></br>

        <div className="text-right">
          <button id="btnConfirmarCriarInstrumento" className="btn btn-success" >Salvar</button>
        </div>


      </div>


        <div className="modal fade" id="modalSucesso" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Instrumento alterado com sucesso!
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
                Deseja realmente editar o Instrumento?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarInstrumento" type="button" className="btn btn-primary">Salvar</button>
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


  private onChangeTipoInstrumento = (val) => {
    this.setState({
      valorItemsTipoInstrumento: val,
    });
  }

  private onChangeEnviarFilial = (val) => {
    this.setState({
      valorItemsEnviarFilial: val,
    });
  }

  private onChangeFabricante = (val) => {
    this.setState({
      valorItemsTipoInstrumento: val,
    });
  }


  protected getInstrumento() {

    console.log("entrou no proposta");

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Instrumento')/items?$select=ID,Title,Fabricante/ID,Modelo,Resolucao,Descricao,Filial/ID,NumeroDeSerie,TipoDeInstrumento/ID,nrCertificado,DataAfericao,NumeroDeSerie,DiasProximaAfericao&$expand=Fabricante,Filial,TipoDeInstrumento&$filter=ID eq ` + _idInstrumento,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      async: false,
      success: async (resultData) => {

        console.log("resultData Proposta", resultData);

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var cac = resultData.d.results[i].Title;
            _valorCacAntigo = cac;
            var modelo = resultData.d.results[i].Modelo;
            var resolucao = resultData.d.results[i].Resolucao;
            var numeroDeSerie = resultData.d.results[i].NumeroDeSerie;
            var diasProximaAfericao = resultData.d.results[i].DiasProximaAfericao;
            var numeroCertificado = resultData.d.results[i].nrCertificado;
            var dataAfericao = resultData.d.results[i].DataAfericao;

            jQuery("#txtCAC").html(cac);
            jQuery("#txtModelo").val(modelo);
            jQuery("#txtResolucao").val(resolucao);
            jQuery("#txtNumeroSerie").val(numeroDeSerie);
            jQuery("#nroDiasProximaAfericao").val(diasProximaAfericao);
            jQuery("#nroNumeroCertificado").val(numeroCertificado);

            this.setState({
              valorItemsEnviarFilial: resultData.d.results[i].Filial.ID,
              valorItemsFabricante: resultData.d.results[i].Fabricante.ID,
              valorItemsTipoInstrumento: resultData.d.results[i].TipoDeInstrumento.ID,
            });

            if (dataAfericao != null) {

              var dtDataAfericao = new Date(dataAfericao);
              _dataAfericao = dtDataAfericao;

            } else _dataAfericao = null;
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


  protected modalConfirmar() {

    jQuery("#modalConfirmar").modal({ backdrop: 'static', keyboard: false });

  }

  protected async salvar() {

    jQuery("#btnEditarInstrumento").prop("disabled", true);

    var fabricante = jQuery("#ddlFabricante").val();
    if (fabricante == 0) fabricante = null;
    var modelo = jQuery("#txtModelo").val();
    var resolucao = jQuery("#txtResolucao").val();

    var filial = jQuery("#ddlFilial").val();
    if (filial == 0) filial = null;

    var numeroSerie = jQuery("#txtNumeroSerie").val();
    var tipoInstrumento = jQuery("#ddlTipoInstrumento").val();
    if (tipoInstrumento == 0) tipoInstrumento = null;
    var numeroCertificado = jQuery("#nroNumeroCertificado").val();
    var diasProximaAfericao = jQuery("#nroDiasProximaAfericao").val();
    if (diasProximaAfericao == "") diasProximaAfericao = null;

    var dataAfericao = "" + jQuery("#dtDataAfericao-label").val() + "";
    var dataAfericaoDia = dataAfericao.substring(0, 2);
    var dataAfericaoMes = dataAfericao.substring(3, 5);
    var dataAfericaoAno = dataAfericao.substring(6, 10);
    var formdataAfericao = dataAfericaoAno + "-" + dataAfericaoMes + "-" + dataAfericaoDia;

    if (dataAfericao == "") formdataAfericao = null;


    await _web.lists
      .getByTitle("Instrumento")
      .items.getById(_idInstrumento).update({
        FabricanteId: fabricante,
        Modelo: modelo,
        Resolucao: resolucao,
        FilialId: filial,
        NumeroDeSerie: numeroSerie,
        TipoDeInstrumentoId: tipoInstrumento,
      })
      .then(async response => {

        console.log("gravou!!");
        jQuery("#modalConfirmar").modal('hide');
        jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

      })

  }

  protected fecharSucesso() {

    jQuery("#modalSucesso").modal('hide');
    window.location.href = `Instrumento-Editar.aspx?InstrumentoID=` + _idInstrumento;

  }


}
