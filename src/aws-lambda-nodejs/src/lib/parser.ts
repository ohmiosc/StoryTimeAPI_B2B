export function parseAndroidReceipt(receiptString) {
  const receiptArray = receiptString.split('');
  let firstStageString = '';
  for (let i = 0; i < receiptArray.length; i++) {
    if (receiptArray[i] === '\\'){
      receiptArray[i] = '';
    }
    if (receiptArray[i] === '\"' && receiptArray[i + 1] === '{'){
      receiptArray[i] = '';
    }
    firstStageString = firstStageString + receiptArray[i];
  }

  const firstStageArray = firstStageString.split('');
  let jsonString = '';
  for (let i = 0; i < firstStageArray.length; i ++ ) {

    if (firstStageArray[i] === '}' && firstStageArray[i + 1] && firstStageArray[i + 1] === '\"') {
      firstStageArray[i + 1] = '';
    }
    jsonString = jsonString + firstStageArray[i];
  }
  return JSON.parse(jsonString);
}
