import AuthService from './AuthService'
import axios from 'axios'

const Auth = new AuthService()

export default class Calculate {

    getProblemConfig(problemName) {
        axios.get(`http://localhost:5000/api/problem/${problemName}`)
            .then( ({data}) => {
                return data
            })
            .catch( err => {
                return "Error " + err
            })
    }

    getFileSource(file) {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsText(file);
        });
    }

    getText(url) {
        return new Promise((resolve,reject) => {
            axios.get(url)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => reject(console.log(err)))
        })
    }

    passApi(data,i,problemName,stdin,stdout) {
        return new Promise( async (resolve,reject) => {
            let newstdin = await this.getText(`http://localhost:5000/uploads/${problemName}/${stdin[i]}`)
            let newstdout = await this.getText(`http://localhost:5000/uploads/${problemName}/${stdout[i]}`)
            const NEW = {
                stdin: newstdin,
                expected_output: newstdout
            }
            const APIURL = 'https://api.judge0.com'
            const Query = '/submissions?wait=true'
            const JUDGE = Object.assign(NEW,data)
            axios.post(APIURL + Query, JUDGE)
                .then( res => {
                    if(res.data.status.id === 6) {
                        let text = {
                            "result": res.data.status.description,
                            "message": res.data.compile_output
                        }
                        resolve(text)
                    }
                    if(res.data.status.id === 5) {
                        // Time limit
                        let text = {
                            "result": res.data.status.description,
                        }
                        resolve(text)
                    }
                    let text = {
                        "result": res.data.status.description,
                        "time": res.data.time,
                        "memory": res.data.memory
                    }
                    resolve(text)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    addSubmission = (problemName,user,score,pass,time,memory,compile) => {
        return new Promise ((resolve,reject) => {
            const data = {
                name: problemName,
                pass: pass,
                score: score,
                time: time,
                memory: memory,
                compile: compile,
                email: user
            }
            axios.post('http://localhost:5000/api/problem/submit', data)
                .then(res => {
                    resolve(data)
                })
                .catch( err => {
                    console.log(err)
                })
        })
    }

    calScore(stdin, stdout ,user, file, selectedLanguage, data,problemName) {
        return new Promise( async (resolve,reject) => {

            if(Auth.getUser() !== user)  reject('Cannot Send! (Please contact admin.)')
            
            const numTest = stdin.length
            if(numTest !== stdout.length)  reject('TestCase was Wrong! (Please contact admin.)')
            
            const config = this.getProblemConfig(user)
            if(typeof(config) ===  "string")  reject('Config File is not response! (Please contact admin.)')
            let score = ''

            const source_code = await this.getFileSource(file)
            const lang_id = this.getLang(selectedLanguage)
            var newData = {
                "source_code": source_code,
                "language_id": lang_id
            }
            let WorseTime = 0;
            let WorseMem = 0;
            let isPass = true 
            newData = Object.assign(newData,data)
            for(let i = 0;i< numTest;i++) {
                try {
                    const result = await this.passApi(newData,i,problemName,stdin,stdout)
                    if(result.result === 'Compilation Error') {
                        isPass = false
                        const res = await this.addSubmission(problemName,user,'Compliation Error',
                            isPass,'-','-',result.message)
                        resolve(res)
                        return;
                    } else if (result.result === 'Time Limit Exceeded') {
                        WorseTime = Math.max(Number(result.time),WorseTime)
                        WorseMem = Math.max(result.memory,WorseMem)
                        isPass = false
                        score += 'T'
                    } else {
                        WorseTime = Math.max(Number(result.time),WorseTime)
                        WorseMem = Math.max(result.memory,WorseMem)
                        if(result.result !== 'Accepted') {
                            isPass = false
                        }
                        score += (result.result === 'Accepted') ? 'P': '-'
                    }
                } catch (err) {
                    reject(err)
                }
            }
            const res = await this.addSubmission(problemName,user,score,isPass,WorseTime,WorseMem,null)
            resolve(res)
        })
    }

    

}