import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable()
export class ConfigService {
  constructor() {}

  /**
   * 查询条件表单配置
   */
  get searchForm(): any {
    return [{
      key: 'radioGroup',
      props: {
        name: 'radioGroup',
        children: [{ label: '全部', value: '' }, { label: '正常', value: 0 }, { label: '异常', value: 1 }],
      },
      fieldDecorator: {
        label: 'radioGroup',
        initialValue: '',
      },
    }, {
      key: 'inputGroup',
      fieldDecorator: {
        label: 'group',
      },
      props: {
        children: [{
          key: 'select',
          fieldDecorator: {
            initialValue: ''
          },
          props: {
            name: 'groupSelect',
            style: { width: '30%' },
            ngModelChange: (value: any, control: FormControl, validateForm: FormGroup) => {
              validateForm.get('groupInput').setValue(value);
            },
            children: [{ label: '全部', value: '' }, { label: '正常', value: 0 }, { label: '异常', value: 1 }],
          }
        }, {
          key: 'input',
          fieldDecorator: {
            initialValue: '',
          },
          props: {
            name: 'groupInput',
            format: (value: string) => (value || '').indexOf('$') !== -1 ? value : ('$' + value),
            style: { width: '70%' },
            placeholder: '测试group',
          }
        }],
      }
    }, {
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
    }, {
      key: 'select',
      props: {
        name: 'checkResult',
        children: [{ label: '全部', value: '' }, { label: '正常', value: 0 }, { label: '异常', value: 1 }],
        placeholder: '请选择考勤状态',
      },
      fieldDecorator: {
        label: '考勤状态',
        initialValue: '',
      },
    }, {
      key: 'input',
      isShow: (validateForm: any) => {
        return validateForm.value.checkResult === '0';
      },
      fieldDecorator: {
        label: '用户信息',
      },
      props: {
        name: 'keyWord',
        format: (val: any) => (typeof val === 'string' ? val.replace(/^\s*/g, '') : val),
        placeholder: '请输入中文名/英文名/工号查询',
      },
    }];
  }

  /**
   * 动态table配置
   */
  get tableColumn(): any[] {
    return [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    }, {
      title: '工号',
      dataIndex: 'userCode',
      key: 'userCode',
      width: 140,
    }, {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 140,
    }, {
      title: '小组',
      dataIndex: 'projectTeam',
      key: 'projectTeam',
      width: 140,
    }, {
      title: '日期',
      dataIndex: 'day',
      key: 'day',
      width: 140,
    }];
  }
}
