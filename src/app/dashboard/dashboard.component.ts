import { DashboardService } from './../services/dashboard.service';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  orders_data: any;
  generic_data: any;
  inven_data: any;
  showInven_cost: any;
  data_po: any = [];
  data_po_price: any = [];
  barChartData2: any[] = [];
  _data = [];
  chartOptions_Orders: any;
  chartOptions_purchase: any;
  chartOptions_Inventory: any;

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.showGraph_Orders();
    this.showGraph_purchase();
    this.showGraph_Inventory();
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
      // console.log(this.orders_data);
      this.orders_data.forEach(e => {
        if (e.purchase_order_status === "ORDERPOINT") {
          e.purchase_order_status = "ก่อนเตรียมใบสั่งซื้อ"
          this.data_po[0] = e.count_status;
          this.data_po_price[0] = e.total_price;
        }
        else if (e.purchase_order_status === "PREPARED") {
          e.purchase_order_status = "เตรียมใบสั่งซื้อ"
          this.data_po[1] = e.count_status;
          this.data_po_price[1] = e.total_price;
        }
        else if (e.purchase_order_status === "CONFIRMED") {
          e.purchase_order_status = "ยืนยันการสั่งซื้อ";
          this.data_po[2] = e.count_status;
          this.data_po_price[2] = e.total_price;
        }
        else if (e.purchase_order_status === "APPROVED") {
          e.purchase_order_status = "อนุมัติ";
          this.data_po[3] = e.count_status;
          this.data_po_price[3] = e.total_price;
        }
        else if (e.purchase_order_status === "COMPLETED") {
          e.purchase_order_status = "รับเข้าคลัง";
          this.data_po[4] = e.count_status;
          this.data_po_price[4] = e.total_price;
        }
        else e.purchase_order_status = "ไม่ระบุ";
        this._data.push({
          name: e.purchase_order_status,
          y: e.count_status
        })
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
  async showGraph_purchase() {
    const rs: any = await this.dashboardService.generic_data();
    let data_generic: any = [];
    let data_product: any = [];
    let data_generic_per: any = [];
    let data_product_per: any = [];
    let data_name: any = [];

    if (rs.ok) {
      this.generic_data = rs.rows;
      this.generic_data.forEach(e => {
        data_name.push(e.generic_type_name);
        data_generic.push(e.count_generic_id);
        data_product.push(e.count_product_id);
        const per = (e.count_generic_id * 100) / e.count_product_id;
        data_generic_per.push({ y: per, name: 'เวชภัณฑ์ที่ถึงจุดสั่งซื้อ ' + e.count_generic_id + ' รายการ' });
        data_product_per.push({ y: 100 - per, name: 'เวชภัณฑ์ที่ยังไม่ถึงจุดสั่งซื้อ ' + (e.count_product_id - e.count_generic_id) + ' รายการ' });
      });
    }
    this.chartOptions_purchase = {
      chart: {
        type: 'bar'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: 'คิดเป็น: <b>{point.percentage:.0f}% {series.y}</b>'
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
        name: 'เวชภัณฑ์ที่ยังไม่ถึงจุดสั่งซื้อ',
        data: data_product_per
      }, {
        name: 'เวชภัณฑ์ที่ถึงจุดสั่งซื้อ',
        data: data_generic_per
      }]
    }
  }
  async showGraph_Inventory() {
    const rs: any = await this.dashboardService.showInven_cost();
    let data_Inventory: any = [];
    if (rs.ok) {
      this.showInven_cost = rs.rows;
      this.showInven_cost.forEach(e => {
        data_Inventory.push({ name: e.warehouse_name, y: e.sum_cost });
      });
    }
    // console.log(data_Inventory);
    this.chartOptions_Inventory = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<b>{point.y:.0f}</b> รายการที่ถึงจุดเติม'
      },
      series: [{
        name: '',
        data: data_Inventory,
        dataLabels: {
          enabled: true,
          rotation: 0,
          color: '#FFFFFF',
          align: 'center',
          format: '{point.y:.0f}', // one decimal
          y: 50, // 10 pixels down from the top
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    }
  }
}

