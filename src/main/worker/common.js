//import ProcessExtend from '@/main/utils/ProcessExtend'
import {getEnvironmentData, parentPort, workerData} from 'worker_threads';
//公共调用 worker ，直接调用类的静态方法

console.log('getEnvironmentData',getEnvironmentData('electronMain'));

(async () => {

    const {classMethod, data} = workerData;
    const [className, methodName] = classMethod.split('.')
    let result = null;
    // if (className == ProcessExtend.name) {
    //     result = await ProcessExtend[methodName](data);
    // }
    parentPort.postMessage(result);
})()
