import * as React from 'react';
import styles from './LaboratorioCalibracaoNovaOcorrencia.module.scss';
import { ILaboratorioCalibracaoNovaOcorrenciaProps } from './ILaboratorioCalibracaoNovaOcorrenciaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import * as jQuery from "jquery";
import { allowOverscrollOnElement, DatePicker } from 'office-ui-fabric-react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import "bootstrap";
import { Web } from 'sp-pnp-js';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;

export interface IShowEmployeeStates {
  itemsTecnicos: any[]
}

export interface IReactGetItemsState {
  itemsTipoOcorrencia: [
    {
      "ID": any,
      "Title": any,
    }],
  itemsFilial: [
    {
      "ID": any,
      "Title": any,
    }],
  itemsTecnicos: []


}


const empTablecolumns = [
  {
    dataField: "codigo_tec",
    text: "CODIGO_TEC",
    headerStyle: { "backgroundColor": "#bee5eb", "text-align": "center" },
    sort: true,
    classes: 'text-center',
  },
  {
    dataField: "cod_filial",
    text: "COD_FILIAL",
    headerStyle: { "backgroundColor": "#bee5eb", "text-align": "center" },
    sort: true,
    classes: 'text-center',
  },
  {
    dataField: "Title",
    text: "TITLE",
    headerStyle: { "backgroundColor": "#bee5eb", "text-align": "center" },
    sort: true,
  },
  {
    dataField: "cargo",
    text: "CARGO",
    headerStyle: { "backgroundColor": "#bee5eb", "text-align": "center" },
    sort: true,
  },
  {
    dataField: "setor",
    text: "SETOR",
    headerStyle: { "backgroundColor": "#bee5eb", "text-align": "center" },
    sort: true,
  },
  {
    dataField: "cod_estab",
    text: "COD_ESTAB",
    headerStyle: { "backgroundColor": "#bee5eb", "text-align": "center" },
    sort: true,
    classes: 'text-center',
  },
  {
    dataField: "",
    text: "",
    headerStyle: { "backgroundColor": "#bee5eb", "text-align": "center" },
    sort: true,
    classes: 'text-center',
    formatter: (rowContent, row) => {

      console.log("row", row);

      return (
        <>
          <button data-dismiss="modal" onClick={() => { $("#txtTecnico").val(row.Title); $("#txtTecnicoCodTecnico").val(row.codigo_tec); $("#txtTecnicoCodFilial").val(row.cod_filial); $("#txtTecnicoCargo").val(row.cargo); $("#txtTecnicoCodEmitente").val(row.cod_emitente); $("#txtTecnicoEstabelecimento ").val(row.cod_estab); $("#modalTecnicos").modal('hide'); }} className="btn-info btn-sm">Escolher</button>
        </>
      )

    }
  },


]


const paginationOptions = {
  sizePerPage: 5,
  hideSizePerPage: true,
  hidePageListOnlyOnePage: true
};


export default class LaboratorioCalibracaoNovaOcorrencia extends React.Component<ILaboratorioCalibracaoNovaOcorrenciaProps, IReactGetItemsState> {



  public constructor(props: ILaboratorioCalibracaoNovaOcorrenciaProps, state: IReactGetItemsState) {
    super(props);
    this.state = {
      itemsTipoOcorrencia: [
        {
          "ID": "",
          "Title": "",
        }],
      itemsFilial: [
        {
          "ID": "",
          "Title": "",
        }],
      itemsTecnicos: []

    };
  }

  public componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);

    jQuery('.certificado').hide();
    jQuery('.transferirCACoutraFilial').hide();
    jQuery('.modificarTecnicoCAC').hide();

    document
      .getElementById("btnBuscarTecnico")
      .addEventListener("click", (e: Event) => this.buscarTecnico());
/*
    document
      .getElementById("btnConfirmarCriarOcorrencia")
      .addEventListener("click", (e: Event) => this.modalConfirmar());
*/
      document
      .getElementById("btnConfirmarCriarOcorrencia")
      .addEventListener("click", (e: Event) => this.btCriarOcorrencia());

    document
      .getElementById("btnCriarOcorrencia")
      .addEventListener("click", (e: Event) => this.btCriarOcorrencia());

    this.handler();

  }


  public render(): React.ReactElement<ILaboratorioCalibracaoNovaOcorrenciaProps> {
    return (


      <><div id="container">

        <div className="form-group">
          <label htmlFor="txtNumero">Número</label><span className="required"> *</span>
          <input type="text" className="form-control" id="txtNumero" />
        </div>

        <div className="form-group">
          <label htmlFor="txtCAC">CAC</label><span className="required"> *</span>
          <input type="text" className="form-control" id="txtCAC" />
        </div>

        <div className="form-group">
          <label htmlFor="ddlTipoOcorrencia">Tipo de ocorrência</label><span className="required"> *</span>
          <select id="ddlTipoOcorrencia" className="form-control" style={{ "width": "300px" }} onChange={(e) => this.mostrarCampos()}>
            <option value="0" selected>Selecione...</option>
            {this.state.itemsTipoOcorrencia.map(function (item, key) {
              return (
                <option value={item.ID}>{item.Title}</option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="txtObservacao">Observação</label><span className="required"> *</span>
          <textarea id='txtObservacao' className="form-control" rows={3} required></textarea>
        </div>

        <div className="form-group certificado">
          <label htmlFor="nroNumeroCertificado">Número do Certificado</label><span className="required"> *</span>
          <input type="number" style={{ "width": "300px" }} className="form-control" id="nroNumeroCertificado" />
        </div>

        <div className="form-group certificado">
          <label htmlFor="dtDataAfericao">Data de aferição</label><span className="required"> *</span>
          <DatePicker style={{ "width": "300px" }} minDate={new Date()} formatDate={this.onFormatDate} isMonthPickerVisible={false} className="datePicker" id='dtDataAfericao' />
        </div>

        <div className="form-group certificado">
          <label htmlFor="dtDataVencimento">Vencimento</label><span className="required"> *</span>
          <DatePicker style={{ "width": "300px" }} minDate={new Date()} formatDate={this.onFormatDate} isMonthPickerVisible={false} className="datePicker" id='dtDataVencimento' />
        </div>

        <div className="form-group transferirCACoutraFilial">
          <label htmlFor="ddlTipoOcorrencia">Enviar para filial</label><span className="required"> *</span>
          <select id="ddlFilial" className="form-control" style={{ "width": "300px" }}>
            <option value="0" selected>Selecione...</option>
            {this.state.itemsFilial.map(function (item, key) {
              return (
                <option value={item.ID}>{item.Title}</option>
              );
            })}
          </select>
        </div>

        <div className="form-group modificarTecnicoCAC">
          <label htmlFor="txtTecnico">Nome Técnico</label><span className="required"> *</span>
          <input type="text" className="form-control" id="txtTecnico" />
          <br></br><button id='btnBuscarTecnico' type="button" className="btn btn-info btn-sm">Buscar técnico</button>
        </div>

        <div className="form-group modificarTecnicoCAC">
          <label htmlFor="txtTecnicoCodTecnico">Código Técnico</label><span className="required"> *</span>
          <input style={{ "width": "300px" }} type="text" className="form-control" id="txtTecnicoCodTecnico" />
        </div>

        <div className="form-group modificarTecnicoCAC">
          <label htmlFor="txtTecnicoCodFilial">Código Filial</label><span className="required"> *</span>
          <input style={{ "width": "300px" }} type="text" className="form-control" id="txtTecnicoCodFilial" />
        </div>

        <div className="form-group modificarTecnicoCAC">
          <label htmlFor="txtTecnicoCargo">Cargo</label><span className="required"> *</span>
          <input type="text" className="form-control" id="txtTecnicoCargo" />
        </div>


        <div className="form-group modificarTecnicoCAC">
          <label htmlFor="txtTecnicoCodEmitente">COD Emitente</label><span className="required"> *</span>
          <input style={{ "width": "300px" }} type="text" className="form-control" id="txtTecnicoCodEmitente" />
        </div>

        <div className="form-group modificarTecnicoCAC">
          <label htmlFor="txtTecnicoEstabelecimento">COD Estabelicmento</label><span className="required"> *</span>
          <input style={{ "width": "300px" }} type="text" className="form-control" id="txtTecnicoEstabelecimento" />
        </div>


        <div className="modal fade bd-example-modal-lg" id="modalTecnicos" tabIndex={-1} role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Buscar técnico</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <BootstrapTable bootstrap4 responsive condensed hover={true} keyField='id' data={this.state.itemsTecnicos} columns={empTablecolumns} headerClasses="header-class" pagination={paginationFactory(paginationOptions)} filter={filterFactory()} />
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarIniciarFluxo" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente criar a Ocorrência?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCriarOcorrencia" type="button" className="btn btn-primary">Criar</button>
              </div>
            </div>
          </div>
        </div>

        <br></br>

        <div className="text-right">
          <button id="btnConfirmarCriarOcorrencia" className="btn btn-success" >Criar Ocorrência</button>
        </div>


      </div>

      </>


    );
  }


  protected handler() {

    var reactHandlerTipoOcorrencia = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('TipoDeOcorrencia')/items?$top=50&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandlerTipoOcorrencia.setState({
          itemsTipoOcorrencia: resultData.d.results
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


    var reactHandlerRepresentante = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Tecnicos')/items?$top=4999&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        jQuery('#txtCountProposta').html(resultData.d.results.length);
        reactHandlerRepresentante.setState({
          itemsTecnicos: resultData.d.results
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
  };



  private mostrarCampos = () => {

    var tipoOcorrencia = $('#ddlTipoOcorrencia option:selected').text();

    console.log(tipoOcorrencia);

    if (tipoOcorrencia == "Certificado") {

      jQuery('.certificado').show();

    } else {

      jQuery('.certificado').hide();
    }

    if (tipoOcorrencia == "Transferir CAC para outra Filial") {

      jQuery('.transferirCACoutraFilial').show();

    } else {

      jQuery('.transferirCACoutraFilial').hide();
    }

    if (tipoOcorrencia == "Modificar Tecnico do CAC") {

      jQuery('.modificarTecnicoCAC').show();

    } else {

      jQuery('.modificarTecnicoCAC').hide();
    }



  }

  private buscarTecnico = () => {

    jQuery("#modalTecnicos").modal({ backdrop: 'static', keyboard: false });

  }

  protected modalConfirmar() {

    jQuery("#modalConfirmarIniciarFluxo").modal({ backdrop: 'static', keyboard: false });

  }

  protected async btCriarOcorrencia() {

    var numero = $("#txtNumero").val();
    var cac = $("#txtCAC").val();
    var tipoOcorrencia = $("#ddlTipoOcorrencia").val();
    var txtObservacao = $("#txtObservacao").val();
    var numeroCertificado = $("#nroNumeroCertificado").val();

    var dataAfericao = "" + jQuery("#dtDataAfericao-label").val() + "";
    var dataAfericaoDia = dataAfericao.substring(0, 2);
    var dataAfericaoMes = dataAfericao.substring(3, 5);
    var dataAfericaoAno = dataAfericao.substring(6, 10);
    var formdataAfericao = dataAfericaoAno + "-" + dataAfericaoMes + "-" + dataAfericaoDia;

    var dataVencimento = "" + jQuery("#dtDataVencimento-label").val() + "";
    var dataVencimentoDia = dataVencimento.substring(0, 2);
    var dataVencimentoMes = dataVencimento.substring(3, 5);
    var dataVencimentoAno = dataVencimento.substring(6, 10);
    var formdataVencimento = dataVencimentoAno + "-" + dataVencimentoMes + "-" + dataVencimentoDia;
    
    var filial = $("#ddlFilial").val();
    var tecnico = $("#txtTecnico").val();

    if(tecnico == 0) tecnico = null;
    
    var tecnicoCodTecnico = $("#txtTecnicoCodTecnico").val();
    var tecnicoCodFilial = $("#txtTecnicoCodFilial").val();
    var tecnicoCargo = $("#txtTecnicoCargo").val();
    var tecnicoCodEmitente = $("#txtTecnicoCodEmitente").val();
    var tecnicoEstabelecimento = $("#txtTecnicoEstabelecimento").val();

    console.log("numero",numero);
    console.log("cac",cac);
    console.log("tipoOcorrencia",tipoOcorrencia);
    console.log("txtObservacao",txtObservacao );
    console.log("numeroCertificado",numeroCertificado);
    console.log("formdataAfericao",formdataAfericao);
    console.log("formdataVencimento",formdataVencimento);
    console.log("filial",filial);
    console.log("tecnico",tecnico);
    console.log("tecnicoCodTecnico",tecnicoCodTecnico);
    console.log("tecnicoCodFilial",tecnicoCodFilial);
    console.log("tecnicoCargo",tecnicoCargo);
    console.log("tecnicoCodEmitente",tecnicoCodEmitente);
    console.log("tecnicoEstabelecimento",tecnicoEstabelecimento);

    await _web.lists
      .getByTitle("Ocorrencia")
      .items.add({
        Title: numero,
        CAC: cac,
        TipoDeOcorrenciaId: tipoOcorrencia,
        Obs: txtObservacao,
        nrCertificado: numeroCertificado,
        DataAfericao: formdataAfericao,
        Vencimento: formdataVencimento,
        //FilialFinal: filial,
        TecInicial_x003a_codigo_tec: tecnicoCodTecnico,
        TecInicial: tecnico,
        TecInicial_x003a_cod_filial: tecnicoCodFilial,
        TecInicial_x003a_Cargo: tecnicoCargo,
        TecInicial_x003a_cod_emitente: tecnicoCodEmitente,
        TecInicial_x003a_cod_estab: tecnicoEstabelecimento
      })
      .then(response => {

        console.log("gravou!!");

      })
      .catch((error: any) => {
        console.log(error);

      })

  }



}
