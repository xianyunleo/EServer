import ProcessExtend from "@/main/utils/ProcessExtend";

export async function callStatic(className, methodName, args) {
    let result;
    if (className === ProcessExtend.name) {
        result = await ProcessExtend[methodName](...args);
    }
    return result;
}
