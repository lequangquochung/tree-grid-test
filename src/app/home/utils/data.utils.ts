export class DataUtils {
  static getFullRecordWithoutNested(data: object[]): any {
    const dataWithoutNested: any[] = [];
    data.map((record: any) => {
      dataWithoutNested.push(record);
      if (record.subtasks && record.subtasks.length) {
        this.getFullRecordWithoutNested(record.subtasks);
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
