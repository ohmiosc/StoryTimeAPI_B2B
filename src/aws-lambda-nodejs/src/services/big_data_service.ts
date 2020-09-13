import { BadRequestException, Injectable } from '@nestjs/common';
import { IValidator, validateInput } from '../lib/validator';
import * as constants from '../constants';
import { BigDataResponse } from '../responses/big_data_response';
import { SQSController } from '../lib/sqs_controller';
import { errorResponse, ErrorResponse } from '../responses/error_response';

@Injectable()
export class BigDataService {

  private sqsController: SQSController;

  constructor() {
    this.sqsController = new SQSController();
  }

  public async saveData(input: any): Promise<BigDataResponse | ErrorResponse> {
    const inputValidator: IValidator = validateInput(['deviceID'], input);

    if (!input || !inputValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, inputValidator.message);
    }

    let queue = await this.sqsController.getQueueUrl(constants.QUEUE_NAME);

    if (queue === null) {
      console.log(`Queue ${constants.QUEUE_NAME} not found`);
      queue = await this.sqsController.createQueue(constants.QUEUE_NAME);

      if (queue === null) {
        return new BigDataResponse(false, `Could not create queue ${constants.QUEUE_NAME}`);
      }
    }

    if (!input.data) throw new BadRequestException('Data field is empty');

    const dataArray = this.createDataParseList(input.data);
    const eventsArray  = this.prepareEvents(input, dataArray, queue);

    const isMessageSent = await Promise.all(eventsArray);

    // const isMessageSent = await this.sqsController.sendMessage(queue, input);

    if (!isMessageSent) {
      return new BigDataResponse(false, 'Error has occurred while sending message');
    }

    return new BigDataResponse(true, 'Message was sent');

  }

  private prepareEvents(input, dataArray: string[], queueName: string): any {
    const functionsArray = [];

    for (let i = 0; i < dataArray.length; i++) {
      input.data = dataArray[i];
      functionsArray.push(this.sqsController.sendMessage(queueName, input));
    }
    return functionsArray;
  }

  private createDataParseList(input: string): string[] {
    const result_array = [];
    const arr_1 = input.split('timeStampCreated');
    for (let i = 0; i < arr_1.length; i++) {

      if (arr_1[i + 1]) {
        const is_contains_time_on_page = arr_1[i + 1].split(' ')[2].includes('TimeOnPage');
        const time_on_page = is_contains_time_on_page ? ' ' + arr_1[i + 1].split(' ')[2] : '';
        let str = '';

        if (i === 0) {
          const arr_2 = arr_1[i + 1].split(' ');
          str = arr_1[i].trim() + ' timeStampCreated' + arr_2[0] + ' ' + arr_2[1] + time_on_page;
        } else {
          const second_part = ' timeStampCreated' + arr_1[i + 1].split(' ')[0] + ' ' + arr_1[i + 1].split(' ')[1];
          const split_by_space = arr_1[i].split(' ');
          for (let j = 0; j < split_by_space.length - 1; j++) {
            if (j > 1 && !split_by_space[j].includes('TimeOnPage')) {
              str = str + ' ' + split_by_space[j];
            }

            if (!split_by_space[j + 1]) {
              str = str + second_part + time_on_page;
            }
          }
        }
        result_array.push(str);
      }
    }
    return result_array;
  }

}
