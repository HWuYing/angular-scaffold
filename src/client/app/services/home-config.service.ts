import { Injectable } from '@angular/core';

@Injectable()
export class HomeConfigService {
  constructor() {}

  /**
   * 查询条件表单配置
   */
  get searchForm(): any {
    return [
      {
        key: 'monthPicker',
        fieldDecorator: {
          label: '查询月份',
          initialValue: new Date(new Date().setDate(0)),
        },
        props: {
          name: 'month',
          nzPlaceHolder: '请选择查询月份',
          nzAllowClear: false,
        },
      },
      {
        key: 'select',
        props: {
          name: 'checkResult',
          children: [{ label: '全部', value: '' }, { label: '正常', value: 0 }, { label: '异常', value: 1 }],
          nzPlaceHolder: '请选择考勤状态',
        },
        fieldDecorator: {
          label: '考勤状态',
          initialValue: '',
        },
      },
      {
        key: 'input',
        fieldDecorator: {
          label: '用户信息',
        },
        props: {
          name: 'keyWord',
          format: (val: any) => (typeof val === 'string' ? val.replace(/^\s*/g, '') : val),
          placeholder: '请输入中文名/英文名/工号查询',
        },
      },
    ];
  }

  /**
   * 动态table配置
   */
  get tableColumn(): any[] {
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 180,
      },
      {
        title: '工号',
        dataIndex: 'userCode',
        key: 'userCode',
        width: 140,
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        width: 140,
      },
      {
        title: '小组',
        dataIndex: 'projectTeam',
        key: 'projectTeam',
        width: 140,
      },
      {
        title: '日期',
        dataIndex: 'day',
        key: 'day',
        width: 140,
      },
      {
        title: '上班时间',
        dataIndex: 'entranceTime',
        key: 'entranceTime',
      },
      {
        title: '下班时间',
        dataIndex: 'leaveTime',
        key: 'leaveTime',
      },
      {
        title: '时长',
        dataIndex: 'duration',
        key: 'duration',
      },
      {
        title: '班值',
        dataIndex: 'attendanceType',
        key: 'attendanceType',
        width: 140,
      },
      {
        title: '考勤状态',
        dataIndex: 'checkResult',
        key: 'checkResult',
        template: 'checkResult',
      },
      {
        title: '考勤处理',
        dataIndex: 'reason',
        key: 'reason',
        template: 'reason',
        width: 200,
      },
      {
        title: '处理状态',
        dataIndex: 'correctStatus',
        key: 'correctStatus',
        template: 'correctStatus',
        width: 140,
      },
    ];
  }
}
