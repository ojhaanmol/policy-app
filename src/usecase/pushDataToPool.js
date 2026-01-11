class PushDataToPool{

    constructor({processData}){
        if (typeof processData !== 'function')
            throw new Error('processData must be a function');

        this.processData=processData;
    }

    async execute( data ){

        await this.processDataWrapper( new DataEntity(data) )
        
    }

    async processDataWrapper( parsedData ){
        try {

            await this.processData( 
                parsedData.messageEntity.message,
                parsedData.timeEntity.timestamp
            );

        } catch (error) {
            throw new PushDataToPoolError(
                'PUSH DATA TO POOL ERROR, unable to push data to pool gateway error.',
                'PDP',
                error
            )
        }
    }
}

class PushDataToPoolError extends Error{
    constructor(message, errorCode, cause){
        super(message);
        this.errorCode= errorCode;
        this.cause= cause;
    }
}

class DataEntity{
    constructor(data){

        if(!data && typeof data !== 'object')
            throw new Error('DATA ENTITY ERROR: data is required.');

        if(!data.message)
            throw new Error('DATA ENTITY ERROR: data.message is required.');

        if(!data.date)
            throw new Error('DATA ENTITY ERROR: data.date is required.');

        if(!data.time)
            throw new Error('DATA ENTITY ERROR: data.time is required.');

        this.messageEntity= new MessageEntity(data.message);
        this.timeEntity= new TimeEntity(data.date, data.time)
    }
}

class MessageEntity{
    constructor(message){

        if(!message && typeof message !== 'string')
            throw new Error('MESSAGE ENTITY ERROR: Message is required');

        this.message= String(message)
    }
}

class TimeEntity {
    constructor(date, time) {

        if (!date || !time)
            throw new Error('TIME ENTITY ERROR: date and time are required');

        if (typeof date !== 'string' || typeof time !== 'string')
            throw new Error('TIME ENTITY ERROR: date and time must be strings');

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) 
            throw new Error('TIME ENTITY ERROR: date must be in YYYY-MM-DD format');

        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(time))
            throw new Error('TIME ENTITY ERROR: time must be in HH:mm or HH:mm:ss format');

        const iso = `${date}T${time.length === 5 ? time + ':00' : time}`;

        const scheduled = new Date(iso);

        if (isNaN(scheduled.getTime()))
            throw new Error('TIME ENTITY ERROR: invalid date/time');

        const now = new Date();

        if (scheduled <= now)
            throw new Error('TIME ENTITY ERROR: scheduled time must be in the future');

        this.date = date;
        this.time = time;
        this.datetime = scheduled;
        this.timestamp = scheduled.getTime();

    }
}

module.exports= {
    PushDataToPoolError,
    DataEntity,
    MessageEntity,
    TimeEntity,
    PushDataToPool,

}