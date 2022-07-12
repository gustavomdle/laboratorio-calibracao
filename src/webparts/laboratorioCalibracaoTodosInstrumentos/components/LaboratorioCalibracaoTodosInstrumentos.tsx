import * as React from 'react';
import styles from './LaboratorioCalibracaoTodosInstrumentos.module.scss';
import { ILaboratorioCalibracaoTodosInstrumentosProps } from './ILaboratorioCalibracaoTodosInstrumentosProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jQuery from "jquery";
import { Web } from "sp-pnp-js";
import BootstrapTable from 'react-bootstrap-table-next';

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
    headerStyle: { "backgroundColor": "#bee5eb", "width": "180px" },
    formatter: (rowContent, row) => {
      var id = row.ID;
      var status = row.Status
      var urlDetalhes = `Instrumento-Detalhes.aspx?PropostasID=` + id;
      var urlEditar = `Instrumento-Editar.aspx?PropostasID=` + id;

        console.log("_grupos", _grupos);

        if (_grupos.indexOf("Membros do Calibração") !== -1) {
          return (
            <>
              <a href={urlDetalhes}><button className="btn btn-info btnCustom">Exibir</button></a>&nbsp;
              <a href={urlEditar}><button className="btn btn-info btnCustom">Editar</button></a>
            </>
          )
        } else {

          return (
            <>
              <a href={urlDetalhes}><button className="btn btn-info btnCustom">Exibir</button></a>&nbsp;
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

export default class LaboratorioCalibracaoTodosInstrumentos extends React.Component<ILaboratorioCalibracaoTodosInstrumentosProps,IShowEmployeeStates> {

  constructor(props: ILaboratorioCalibracaoTodosInstrumentosProps) {
    super(props);
    this.state = {
      employeeList: []
    }
  }

  public async componentDidMount() {

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


    var reactHandlerRepresentante = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Instrumento')/items?$top=4999&$orderby= ID desc&$select=Title,Fabricante/Title,Modelo,Status/Title,Filial/Title,Tecnico,Status_x0020_do_x0020_Vencimento,nrCertificado,Resolucao,Vencimento,DataAfericao&$expand=Filial,Fabricante,Status`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData",resultData);
        jQuery('#txtCountProposta').html(resultData.d.results.length);
        reactHandlerRepresentante.setState({
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


      <><p>Resultado: <span className="text-info" id="txtCountProposta"></span> proposta(s) encontrada(s)</p>
        <div className={styles.container}>
          <BootstrapTable bootstrap4 responsive condensed hover={true} className="gridTodosItens" id="gridTodosItens" keyField='id' data={this.state.employeeList} columns={empTablecolumns} headerClasses="header-class" pagination={paginationFactory(paginationOptions)} filter={filterFactory()} />
        </div></>


    );
  }
}
