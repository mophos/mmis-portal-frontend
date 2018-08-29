import { DashboardService } from './../services/dashboard.service';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import * as _ from 'lodash';
import { forEach } from '@angular/router/src/utils/collection';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private dashboardService: DashboardService
  ) {
    this.token = sessionStorage.getItem('token')
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId
    this.warehouseName = decodedToken.warehouseName
  }
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  startDate: any;
  endDate: any;
  orders_data: any;
  generic_data: any;
  inven_data: any;
  showInven_cost: any;
  data_po: any = [];
  data_po_price: any = [];
  barChartData2: any[] = [];
  _data = [];
  chartOptions_Orders: any;
  chartOptionsOrderPoint: any;
  getBudgetTransactionChart: any;
  token: any;
  warehouseId: any;
  warehouseName: any;
  SumOrderPoint: any;
  budgetList = [];
  selectedBudgetDetailId: any = '';
  selectedYear: any = moment().get('year') + (moment().get('month') > 8 ? 1 : 0);
  budgetTransactions = [];
  BudgetAll: any;
  BudgetAmount: any;
  budgetchart = 1;
  inventoryValue: any;
  poApproved: any;
  ordersWaiting: any;
  ordersWaitingApprove: any;
  ordersUnpaid: any;

  async ngOnInit() {
    const date = new Date();
    this.startDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 1
      }
    };

    this.endDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    moment.locale();
    await this.getOrderPoint();
    await this.showGraph_Orders();
    await this.getBudgetByYear();
    await this.getInventoryValue();
    await this.getpoApproved();
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  async showGraph_Orders() {
    const rs: any = await this.dashboardService.orders_data();
    if (rs.ok) {
      this.orders_data = rs.rows;
      this.orders_data.forEach(e => {
        if (e.purchase_order_status === "ORDERPOINT") {
          e.purchase_order_status = "ก่อนเตรียมใบสั่งซื้อ"
          this.data_po[0] = e.count_status;
          this.data_po_price[0] = e.total_price;
          this._data[0] = ({
            name: e.purchase_order_status,
            y: e.count_status
          })
        }
        else if (e.purchase_order_status === "PREPARED") {
          e.purchase_order_status = "เตรียมใบสั่งซื้อ"
          this.data_po[1] = e.count_status;
          this.data_po_price[1] = e.total_price;
          this._data[1] = ({
            name: e.purchase_order_status,
            y: e.count_status
          })
        }
        else if (e.purchase_order_status === "CONFIRMED") {
          e.purchase_order_status = "ยืนยันการสั่งซื้อ";
          this.data_po[2] = e.count_status;
          this.data_po_price[2] = e.total_price;
          this._data[2] = ({
            name: e.purchase_order_status,
            y: e.count_status
          })
        }
        else if (e.purchase_order_status === "APPROVED") {
          e.purchase_order_status = "อนุมัติ";
          this.data_po[3] = e.count_status;
          this.data_po_price[3] = e.total_price;
          this._data[3] = ({
            name: e.purchase_order_status,
            y: e.count_status
          })
        }
        else if (e.purchase_order_status === "COMPLETED") {
          e.purchase_order_status = "รับเข้าคลัง";
          this.data_po[4] = e.count_status;
          this.data_po_price[4] = e.total_price;
          this._data[4] = ({
            name: e.purchase_order_status,
            y: e.count_status
          })
        }
        else e.purchase_order_status = "ไม่ระบุ";
      });
    }
    this.chartOptions_Orders = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: 'คิดเป็น: <b>{point.percentage:.0f}% {series.y}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          colors: ['Tomato', 'Turquoise', 'SteelBlue', 'Orange', 'YellowGreen'],
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'สถานะ',
        colorByPoint: true,
        data: this._data
      }],
    };
  }

  async getOrderPoint() {
    const rs: any = await this.dashboardService.showorderPoint(this.warehouseId);
    const data_name = [];
    const data_count = [];
    this.SumOrderPoint = 0;
    for (let i = 0; i < rs.rows.length; i++) {
      if (rs.rows[i][0].count > 0) {
        data_count.push({ y: rs.rows[i][0].count, name: rs.rows[i][0].generic_type_name + ' จำนวน ' + rs.rows[i][0].count + ' รายการ' });
        data_name.push(rs.rows[i][0].generic_type_name)
        this.SumOrderPoint += rs.rows[i][0].count
      }
    }
    this.chartOptionsOrderPoint = {
      chart: {
        type: 'bar'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.y}</b>'
      },
      xAxis: {
        categories: data_name
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: [{
        name: 'รายการที่ถึงจุดสั่งซื้อ',
        data: data_count
      }]
    }
  }

  async getBudgetByYear() {
    if (this.selectedYear) {
      try {
        const rs: any = await this.dashboardService.getBudgetByYear(this.selectedYear);
        if (rs.ok) {
          this.budgetList = rs.rows;
          this.getBudgetTransaction();
          this.getBudgetAll();
        } else {
          console.log(JSON.stringify(rs.error));
        }
      } catch (error) {
      }
    } else {
      this.budgetList = [];
    }
  }

  async getBudgetTransaction() {
    let data_name = [];
    let data_count = [];
    let sDate: any;
    let eDate: any;
    if (this.budgetchart == 1) {
      sDate = `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}`
      eDate = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`
    } else if (this.budgetchart == 2) {
      sDate = `${this.startDate.date.month}`;
      eDate = `${this.endDate.date.month}`;
    }
    if (this.selectedYear) {
      try {
        const rs: any = await this.dashboardService.getBudgetTransaction(this.budgetchart, sDate, eDate, this.selectedYear, this.selectedBudgetDetailId);
        if (rs.ok) {
          rs.rows.forEach(v => {
            if (this.budgetchart == 1) {
              v.date_time = moment(v.date_time).format('DD MMM YYYY');
            } else if (this.budgetchart == 2) {
              v.date_time = moment(v.date_time).format('MMMM');
            }
          });
          this.budgetTransactions = rs.rows
          this.budgetTransactions.forEach(v => {
            data_count.push({ y: v.amount, name: v.budget_desc + ' : จำนวน ' + v.amount + 'บาท' });
            data_name.push(v.date_time);
          });
          this.getBudgetAll();
        } else {
        }
      } catch (error) {
      }
    } else {
      this.budgetTransactions = [];
    }
    this.getBudgetTransactionChart = {
      chart: {
        type: 'spline'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.x}</b>'
      },
      xAxis: {
        categories: data_name
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: [{
        name: 'ประวัติการใช้งบประมาณ',
        data: data_count
      }]
    }
  }

  async getBudgetAll() {
    if (this.selectedBudgetDetailId) {
      const rsAll: any = await this.dashboardService.getBudgetAll(this.selectedBudgetDetailId, this.selectedYear);
      const rsAmount: any = await this.dashboardService.getBudgetAmount(this.selectedBudgetDetailId);
      this.BudgetAll = rsAll.rows[0].amount
      this.BudgetAmount = rsAmount.rows[0].amount
    }
  }

  onStartDateChanged(event: IMyDateModel) {
    this.startDate = event
    this.getBudgetTransaction();
  }

  oneEndDateChanged(event: IMyDateModel) {
    this.endDate = event
    this.getBudgetTransaction();
  }

  dayOrmonth(num: any) {
    this.budgetchart = num
    this.getBudgetTransaction();
  }

  async getInventoryValue() {
    let date = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`
    let date_text = moment(date).format('DD MMMM YYYY');
    const rs: any = await this.dashboardService.getInventoryValue(this.warehouseId, date);
    let data_count = [];
    let data_name = [];
    rs.rows.forEach(v => {
      if (v[0].generic_type_name != null) {
        data_count.push({ y: v[0].cost, name: v[0].generic_type_name });
        data_name.push(v[0].generic_type_name);
      }
    });
    this.inventoryValue = {
      chart: {
        type: 'column'
      },
      title: {
        text: this.warehouseName
      },
      subtitle: {
        text: date_text
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Population (millions)'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{point.y:.2f} </b>'
      },
      series: [{
        name: 'Population',
        data: data_count,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y:.2f}',
          y: 10,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    }
  }

  async getpoApproved() {
    let rsPoApproved: any = await this.dashboardService.getpoApproved()
    let rsOrdersWaiting: any = await this.dashboardService.getOrdersWaiting(this.warehouseId);
    let rsOrdersWaitingApprove: any = await this.dashboardService.getOrdersWaitingApprove(this.warehouseId);
    let rsOrdersUnpaid: any = await this.dashboardService.getOrdersUnpaid(this.warehouseId);
    this.poApproved = rsPoApproved.rows[0].po
    this.ordersWaiting = rsOrdersWaiting.rows[0].total
    this.ordersWaitingApprove = rsOrdersWaitingApprove.rows.length
    this.ordersUnpaid = rsOrdersUnpaid.rows[0].total
  }
}

