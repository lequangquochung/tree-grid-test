import * as moment from 'moment';

export class DataUtils {
  static async parseDateValueToString(data: any[], field: string) {
    data.forEach((record) => {
      if (record[field]) {
        record[field] = moment(record[field]).format('MM/DD/yyyy');
      }
      if (record.subtasks && record.subtasks.length) {
        this.parseDateValueToString(record.subtasks, field);
      }
    });
  }

  static async insertDefaultValueToData(data: any[], field: string, defaultValue: any) {
    data.forEach((record) => {
      record[field] = defaultValue;
      if (record.subtasks && record.subtasks.length) {
        this.insertDefaultValueToData(record.subtasks, field, defaultValue);
      }
    });
  }

  static isColumnHasValue(data: any[], field: string) {
    let result = false;
    data.every((record) => {
      if (record[field]) {
        result = true;
        return false;
      }

      if (record.subtasks && record.subtasks.length) {
        result = this.isColumnHasValue(record.subtasks, field);
        if (result) {
          return false;
        }
      }
      return true;
    });
    return result;
  }

  static getMaxId(dataWithoutNested: any[]) {
    return dataWithoutNested.reduce(function (prev: any, current: any) {
      if (+current.taskID > +prev.taskID) {
        return current;
      } else {
        return prev;
      }
    }).taskID;
  }

  static getParentOf(data: any[], parentID: number): any {
    let result;
    data.every((row) => {
      if (row.taskID == parentID) {
        result = row;
        return false;
      }
      if (row.subtasks && row.subtasks.length) {
        let childResult = this.getParentOf(row.subtasks, parentID);
        if (childResult) {
          result = childResult;
          return false;
        }
      }
      return true;
    });
    return result;
  }

  static isChildOf(data: any[], target: any) {
    let founded = false;
    data.every((record) => {
      if (record.taskID == target.parentID) {
        founded = true;
        return false;
      }
      if (record.subtasks && record.subtasks.length) {
        founded = this.isChildOf(record.subtasks, target);
        if (founded) {
          return false;
        }
      }
      return true;
    });
    return founded;
  }

  static findRecord(data: any[], targetID: any): any {
    let result;
    data.every((row) => {
      if (row.taskID == targetID) {
        result = row;
        return false;
      }
      if (row.subtasks && row.subtasks.length) {
        let childResult = this.getParentOf(row.subtasks, targetID);
        if (childResult) {
          result = childResult;
          return false;
        }
      }
      return true;
    });
    return result;
  }

  static removeRecord(data: any[], target: any) {
    return data.filter((record) => {
      if (record.subtasks && record.subtasks.length) {
        record.subtasks = this.removeRecord(record.subtasks, target);
      }
      return record.taskID != target.taskID;
    });
  }

  static setParentForRecord(data: any[]) {
    data.forEach((record: any) => {
      if (record.subtasks && record.subtasks.length) {
        record.subtasks.forEach((sub: any) => {
          sub['parentID'] = record.taskID;
          if (sub.subtasks && sub.subtasks.length) {
            this.setParentForRecord([sub]);
          }
        });
      }
    });
  }

  static getFullRecordWithoutNested(data: any[], dataWithoutNested: any[] = []): any {
    dataWithoutNested = dataWithoutNested ? dataWithoutNested : [];
    data.forEach((record: any) => {
      this.setParentForRecord([record]);
      dataWithoutNested.push(record);
      if (record.subtasks && record.subtasks.length) {
        this.getFullRecordWithoutNested(record.subtasks, dataWithoutNested);
      }
    });
    return dataWithoutNested;
  }

  static getRootOfItem(data: object[], item: any): any {
    const findItem: any = data.find((record: any) => record.taskID === item.taskID);
    if (!findItem && item?.parentItem?.taskID) {
      return this.getRootOfItem(data, item?.parentItem);
    }
    return { findItem, data };
  }

  static getItemIds(datasets: any[]) {
    const dataStr = JSON.stringify(datasets);
    const ids = dataStr.match(/"taskID":\w+/g)?.map((e) => e.replace('"taskID":', ''));
    return ids;
  }
}
