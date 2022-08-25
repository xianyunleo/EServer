export default class Database {

    static async InitMySQL() {

    }

    static async InitMySQLData() {

    }

    static async resetMysqlPassword(password) {
        if(!password){
            password = 'root';
        }
        console.log(password)
    }


}