const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function getFactors(num) {
  let factors = []
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      factors.push(i)
    }
  }
  return factors
}

let paychecks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
let userPaychecks = []
let taxCollectorPaychecks = []

function playGame() {
  // If there are no more paychecks left, the game is over
  if (paychecks.length === 0) {
    endGame()
    return
  }

  console.log('\nRemaining paychecks: ', paychecks.join(', '))
  rl.question('Choose a paycheck from the remaining: ', (userInput) => {
    let userChoice = parseInt(userInput, 10)

    // Debug: Log the user's choice
    console.log('You chose:', userChoice)

    // Validate user's choice
    if (!paychecks.includes(userChoice)) {
      console.log('Invalid choice. Try again.')
      return playGame() // Retry this turn
    }

    // Add the user's choice
    userPaychecks.push(userChoice)

    // Find tax collector's paychecks
    let factors = getFactors(userChoice)
    let taxCollectorChoices = factors.filter(
      (factor) => paychecks.includes(factor) && factor !== userChoice,
    )
    taxCollectorPaychecks.push(...taxCollectorChoices)

    console.log(
      'Tax collector collects:',
      taxCollectorChoices.join(', ') || 'Nothing',
    )

    // Remove all taken paychecks (user's choice + tax collector's choices)
    paychecks = paychecks.filter(
      (check) => ![userChoice, ...taxCollectorChoices].includes(check),
    )
    console.log('Paychecks left after this turn:', paychecks)

    // Check if no legal moves remain
    let hasLegalMoves = paychecks.some((check) =>
      getFactors(check).some(
        (factor) => factor !== check && paychecks.includes(factor),
      ),
    )

    if (!hasLegalMoves) {
      console.log(
        'No legal moves left. Tax collector takes the remaining paychecks.',
      )
      taxCollectorPaychecks.push(...paychecks)
      paychecks = []
      return endGame()
    }

    // Continue the game
    playGame() // Ensure the next turn starts properly
  })
}

function endGame() {
  // Calculate sums
  let userSum = userPaychecks.reduce((sum, paycheck) => sum + paycheck, 0)
  let taxCollectorSum = taxCollectorPaychecks.reduce(
    (sum, paycheck) => sum + paycheck,
    0,
  )

  // Display results
  console.log('\nGame Over!')
  console.log('Your paychecks: ', userPaychecks, ' Total: ', userSum)
  console.log(
    "Tax collector's paychecks: ",
    taxCollectorPaychecks,
    ' Total: ',
    taxCollectorSum,
  )
  if (userSum > taxCollectorSum) {
    console.log('You beat the tax collector!')
  } else {
    console.log('The tax collector wins!')
  }
  rl.close()
}

// Start the game
playGame()
