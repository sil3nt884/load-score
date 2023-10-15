class SaveScore {
    getInfo() {
        return {
            id: 'cloudScore',
            name: 'Cloud Save Score',
            blocks: [
                {
                    opcode: 'save',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Save score [SCORE]',
                    arguments: {
                        SCORE: {
                            type: Scratch.ArgumentType.NUMBER,
                        }
                    }
                },
                {
                    opcode: 'loadUser',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'getUser'
                },
                {
                    opcode: 'loadScore',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'loadScore'
                }


            ]
        };
    }
    async loadScore() {
        const config = {
            method: "GET"
        }
        try {
            const  results = await fetch(`https://livenowbeta.asuscomm.com:3000/score/${localStorage.getItem('userId')}`, config)
            return await results.text()
        }
        catch (e) {
            return e
        }
    }

    async save(args) {
            const config = {
                method: "POST",
                headers: {
                    'content-type' : "application/json"
                },
                body: JSON.stringify({
                    id: localStorage.getItem('userId'),
                    score: args.SCORE
                })
            }
            try {
                const  results = await fetch('https://livenowbeta.asuscomm.com:3000/save', config)
                return results.status
            }
            catch (e) {
                return e
            }

    }
    async loadUser (){
        const id = localStorage.getItem('userId')
        if (id) {
            return id
        }
        else {
            return this.saveUser()
        }
    }
   createUserId (){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    saveUser() {
        const id = this.createUserId()
        localStorage.setItem('userId', id)
        return id
    }

}

Scratch.extensions.register(new SaveScore());