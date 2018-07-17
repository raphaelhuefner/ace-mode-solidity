

function stopBuild(...reasons) {
  console.log('#'.repeat(80));
  let stackHandle = {};
  Error.captureStackTrace(stackHandle, stopBuild);
  console.log(stackHandle.stack);
  for (let reason of reasons) {
    console.log(reason);
  }
  console.log('#'.repeat(80));
  let lastReason = reasons.pop();
  process.exit(Number.isInteger(lastReason) ? lastReason : 1);
}

module.exports = stopBuild;
