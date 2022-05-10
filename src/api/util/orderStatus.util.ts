import _ from "lodash";

export const setOrderStatusText = (orderStatus: number) => {
  let statusText: string;
  switch (orderStatus) {
    case 101:
      return (statusText = "待付款");
    case 102:
      return (statusText = "交易关闭");
    case 103:
      return (statusText = "交易关闭"); //到时间系统自动取消
    case 201:
      return (statusText = "待发货");
    case 202:
      return (statusText = "退款中");
    case 203:
      return (statusText = "已退款");
    case 300:
      return (statusText = "已备货");
    case 301:
      return (statusText = "已发货");
    case 302:
      return (statusText = "待评价");
    case 303:
      return (statusText = "待评价"); //到时间，未收货的系统自动收货、
    case 401:
      return (statusText = "交易成功"); //到时间，未收货的系统自动收货、
    case 801:
      return (statusText = "拼团待付款");
    case 802:
      return (statusText = "拼团中"); // 如果sum变为0了。则，变成201待发货
    default:
      break;
  }
};

// export const orderStatusList: number[]

export const setOrderBtnText = (orderStatus: number) => {
  let statusText: string;
  switch (orderStatus) {
    case 101:
      return (statusText = "待付款");
    case 102:
      return (statusText = "交易关闭");
    case 103:
      return (statusText = "交易关闭"); //到时间系统自动取消
    case 201:
      return (statusText = "待发货");
    case 202:
      return (statusText = "退款中");
    case 203:
      return (statusText = "已退款");
    case 300:
      return (statusText = "已备货");
    case 301:
      return (statusText = "已发货");
    case 302:
      return (statusText = "待评价");
    case 303:
      return (statusText = "待评价"); //到时间，未收货的系统自动收货、
    case 401:
      return (statusText = "交易成功"); //到时间，未收货的系统自动收货、
    case 801:
      return (statusText = "拼团待付款");
    case 802:
      return (statusText = "拼团中"); // 如果sum变为0了。则，变成201待发货
    default:
      break;
  }
};

export const generateOrderSNNumber = () => {
  const date = new Date();
  return (
    date.getFullYear() +
    _.padStart(date.getMonth().toString(), 2, "0") +
    _.padStart(date.getDay().toString(), 2, "0") +
    _.padStart(date.getHours().toString(), 2, "0") +
    _.padStart(date.getMinutes().toString(), 2, "0") +
    _.padStart(date.getSeconds().toString(), 2, "0") +
    _.random(100000, 999999)
  );
};
