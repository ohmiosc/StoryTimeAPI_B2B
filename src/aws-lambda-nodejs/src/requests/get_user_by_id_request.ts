import { ApiModelProperty } from '@nestjs/swagger';

export class UserByIdRequest {

    @ApiModelProperty({required: true})
    readonly appUserID: string;
}
