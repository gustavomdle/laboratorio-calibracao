import * as React from 'react';
import styles from './LaboratorioCalibracaoTodosInstrumentos.module.scss';
import { ILaboratorioCalibracaoTodosInstrumentosProps } from './ILaboratorioCalibracaoTodosInstrumentosProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jQuery from "jquery";
import { Web } from "sp-pnp-js";
import BootstrapTable from 'react-bootstrap-table-next';
import "bootstrap";

import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { selectFilter } from 'react-bootstrap-table2-filter';
import { numberFilter } from 'react-bootstrap-table2-filter';
import { Comparator } from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;
var _grupos;
var _idParaExcluir;

export interface IShowEmployeeStates {
  employeeList: any[]
}

const customFilter = textFilter({
  placeholder: ' ',  // custom the input placeholder
});

const empTablecolumns = [
  {
    dataField: "Title",
    text: "CAC",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "Fabricante.Title",
    text: "Fabricante",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "Modelo",
    text: "Modelo",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "Status.Title",
    text: "Status",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "Filial.Title",
    text: "Filial",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "Tecnico",
    text: "Tecnico",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "Status_x0020_do_x0020_Vencimento",
    text: "Status do vencimento",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "nrCertificado",
    text: "Nro Certificado",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "Resolucao",
    text: "Resolução",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "Vencimento",
    text: "Vencimento",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter,
    formatter: (rowContent, row) => {
      var dataVencimento = new Date(row.Vencimento);
      var dtDataEntregaPropostaCliente = ("0" + dataVencimento.getDate()).slice(-2) + '/' + ("0" + (dataVencimento.getMonth() + 1)).slice(-2) + '/' + dataVencimento.getFullYear();
      if (dtDataEntregaPropostaCliente == "31/12/1969") dtDataEntregaPropostaCliente = "";
      return dtDataEntregaPropostaCliente;
    }
  },
  {
    dataField: "DataAfericao",
    text: "Data aferição",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter,
    formatter: (rowContent, row) => {
      var dataAfericao = new Date(row.DataAfericao);
      var dtDataAfericao = ("0" + dataAfericao.getDate()).slice(-2) + '/' + ("0" + (dataAfericao.getMonth() + 1)).slice(-2) + '/' + dataAfericao.getFullYear();
      return dtDataAfericao;
    }

  },
  {
    dataField: "",
    text: "",
    headerStyle: { "backgroundColor": "#bee5eb" },
    formatter: (rowContent, row) => {
      var id = row.ID;
      var status = row.Status
      var urlDetalhes = `Instrumento-Detalhes.aspx?InstrumentoID=` + id;
      var urlEditar = `Instrumento-Editar.aspx?InstrumentoID=` + id;

      console.log("_grupos", _grupos);

      if (_grupos.indexOf("Proprietários do Calibração") !== -1) {
        return (
          <>
            <div style={{ "width": "190px" }}>
              <a onClick={async () => { _idParaExcluir = id; jQuery("#modalConfirmarExcluir").modal({ backdrop: 'static', keyboard: false }); }}><button className="btn btn-danger btnCustom btn-sm">Excluir</button></a>&nbsp;
              <a href={urlEditar}><button className="btn btn-secondary btnCustom btn-sm">Editar</button></a>&nbsp;
              <a href={urlDetalhes}><button className="btn btn-info btnCustom btn-sm">Exibir</button></a>
            </div>
          </>
        )
      } else {

        return (
          <>
            <a href={urlDetalhes}><button className="btn btn-info btnCustom">Exibir</button></a>
          </>
        )
      }

    }
  }

]

const paginationOptions = {
  sizePerPage: 20,
  hideSizePerPage: true,
  hidePageListOnlyOnePage: true
};

export default class LaboratorioCalibracaoTodosInstrumentos extends React.Component<ILaboratorioCalibracaoTodosInstrumentosProps, IShowEmployeeStates> {

  constructor(props: ILaboratorioCalibracaoTodosInstrumentosProps) {
    super(props);
    this.state = {
      employeeList: []
    }
  }

  public async componentDidMount() {

    document
      .getElementById("btnExcluirInstrumento")
      .addEventListener("click", (e: Event) => this.excluirInstrumento());

    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso());


    _web = new Web(this.props.context.pageContext.web.absoluteUrl);

    await _web.currentUser.get().then(f => {
      console.log("user", f);
      var id = f.Id;

      var grupos = [];

      jQuery.ajax({
        url: `${this.props.siteurl}/_api/web/GetUserById(${id})/Groups`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        async: false,
        success: async function (resultData) {

          console.log("resultDataGrupo", resultData);

          if (resultData.d.results.length > 0) {

            for (var i = 0; i < resultData.d.results.length; i++) {

              grupos.push(resultData.d.results[i].Title);

            }

          }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }

      })

      console.log("grupos", grupos);
      _grupos = grupos;
    })


    var reactHandler = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Instrumento')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Fabricante/Title,Modelo,Status/Title,Filial/Title,Tecnico,Status_x0020_do_x0020_Vencimento,nrCertificado,Resolucao,Vencimento,DataAfericao&$expand=Filial,Fabricante,Status`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData", resultData);
        jQuery('#txtCountProposta').html(resultData.d.results.length);
        reactHandler.setState({
          employeeList: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


  }


  public render(): React.ReactElement<ILaboratorioCalibracaoTodosInstrumentosProps> {
    return (


      <><p>Resultado: <span className="text-info" id="txtCountProposta"></span> instrumento(s) encontrado(s)</p>
        <div className={styles.container}>
          <BootstrapTable bootstrap4 responsive condensed hover={true} className="gridTodosItens" id="gridTodosItens" keyField='id' data={this.state.employeeList} columns={empTablecolumns} headerClasses="header-class" pagination={paginationFactory(paginationOptions)} filter={filterFactory()} />
        </div>

        <div className="modal fade" id="modalConfirmarExcluir" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente excluir o Instrumento?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnExcluirInstrumento" type="button" className="btn btn-primary">Excluir</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucesso" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Instrumento excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucesso" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

      </>


    );
  }

  protected async excluirInstrumento() {


    const list = _web.lists.getByTitle("Instrumento");
    await list.items.getById(_idParaExcluir).recycle()
      .then(async response => {
        console.log("Item excluido!");
        jQuery("#modalConfirmarExcluir").modal('hide');
        jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });
      })
      .catch((error: any) => {
        console.log(error);

      })

  }


  protected fecharSucesso() {

    jQuery("#modalConfirmarExcluir").modal('hide');
    window.location.href = `Instrumentos.aspx`;

  }
}
