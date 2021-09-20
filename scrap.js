const run = (val) => {

    val = val ? returnCurrency( val) : val;

    console.log(` after currency convert ${val} `)

    return val;
  
  }

  const returnCurrency =  (val) => {

    let currency;
    console.log(` raw ${val} `)
   try {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      currency = formatter.format(val)
      console.log(` currency ${currency}`)
   } catch(error) {currency = val}
   return currency;
  }

const num = run("1000.898766");


console.log(` formatter ${num}`)