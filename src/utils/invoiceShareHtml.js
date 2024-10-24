import moment from 'moment';
//   const {
//     cart,
//     customer,
//     merchantDetails,
//     invoiceNumber,
//     invoiceDate,
//     dueDate,
//     notes,
//     user,
//     subTotal,
//     grandTotal,
//     taxInclusiveTotal,
//     taxes,
//   } = items;
//   const imgUrl =
//     (merchantDetails &&
//       merchantDetails.merchant_brand_logo.length > 0 &&
//       'https://payments.ipaygh.com/app/webroot/img/logo/' +
//         merchantDetails.merchant_brand_logo) ||
//     user.user_merchant_logo;

//   let rows = '';
//   cart.forEach(product => {
//     const itemDesc = `<td style="flex: 3; text-align: start; padding-left: 0.8rem;"><span>${product.itemName}</span></td>`;
//     const price = `<td style="flex: 1; text-align: start; padding-left: 0.8rem;"><span>${new Intl.NumberFormat(
//       'en-US',
//       { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//     ).format(Number(product.amount))}</span></td>`;
//     const qty = `<td style="flex: 1; text-align: start; padding-left: 0.8rem;"><span>${product.quantity}</span></td>`;
//     const amount = `<td style="flex: 1; text-align: start; padding-left: 0.8rem;"><span>${new Intl.NumberFormat(
//       'en-US',
//       { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//     ).format(Number(product.amount) * Number(product.quantity))}</span></td>`;
//     const row =
//       '<tr style="display: flex; flex-direction: row; border-bottom: 0.1px solid #ddd; padding-top: 0.5rem; padding-bottom: 0.5rem">' +
//       itemDesc +
//       price +
//       qty +
//       amount +
//       '</tr>';
//     rows += row;
//   });

//   console.log('danggggg', data);

//   let taxesRows = '';
//   (taxes || []).forEach(tax => {
//     if (tax) {
//       const head = `<th><span>${tax.taxName} (${tax.taxPercent * 100}%) ${
//         tax.appliedAs === 'INCLUSIVE' ? 'Incl' : 'Excl'
//       }</span></th>`;
//       const value = `<td><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
//         'en-US',
//         { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//       ).format(Number(tax.amount))}</span></td>`;
//       const row = `<tr>${head + value}</tr>`;
//       taxesRows += row;
//     }
//   });

//   const htmlContent = `
//         <html>
//           <head>
//             <meta charset="utf-8">
//             <title style="margin-left: auto">Invoice</title>
//             <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
//             <style>
//               ${htmlStyles}
//             </style>
//           </head>
//           <body>
//             <header>
//             ${
//               data && data.invoice
//                 ? '<div class="corner-ribbon top-right sticky blue"><h3 style="color: #fff; font-weight: bold; font-size: 1.2rem">UNPAID</h3></div>'
//                 : '<div style="background: #1AACAC" class="corner-ribbon top-right sticky blue"><h3 style="color: #fff; font-weight: bold; font-size: 1.2rem">PAID</h3></div>'
//             }
//               <div>
//                 <h1 style="text-align: center; background: #fff; color: #30475e">Invoice</h1>
//                 <address>
//                   <h1 style="text-align: start; background: #fff; color: #30475e">${
//                     merchantDetails && merchantDetails.merchant_name
//                   }</h1>
//                   <p>Tin: ${
//                     merchantDetails && merchantDetails.merchant_reg_number
//                   }</p>
//                   <p>${merchantDetails && merchantDetails.merchant_address}</p>
//                   <p>Tel: ${
//                     merchantDetails && merchantDetails.merchant_phone
//                   }</p>
//                   <p>Email: ${
//                     merchantDetails && merchantDetails.merchant_email
//                   }</p>
//                 </address>
//               </div>
//               <img src="${imgUrl}" alt="HTML5 Icon" width="128" height="128">
//             </header>
//             <article>
//             <div>
//               <div >
//                 <h3 style="text-align: start; background: #fff; color: #30475e">Bill To:</h3>
//                 <div style="margin-top:0.6rem" />
//                 <address>
//                   <p>${customer && customer.name}</p>
//                   <div style="margin-top:0.3rem" />
//                   <p>${customer && customer.email}</p>
//                   <div style="margin-top:0.3rem" />
//                   <p>${customer && customer.phone}</p>
//                 </address>
//                 <table class="meta" style="margin-bottom: 0.6rem">
//                   <tr>
//                     <th><span>Invoice Date</span></th>
//                     <td><span>${moment(invoiceDate).format(
//                       'DD-MMM-YYYY',
//                     )}</span></td>
//                   </tr>
//                   <tr>
//                     <th><span>Invoice Number</span></th>
//                     <td><span>${invoiceNumber}</span></td>
//                   </tr>
//                   <tr>
//                     <th><span>Due Date</span></th>
//                     <td><span>${moment(dueDate).format(
//                       'DD-MMM-YYYY',
//                     )}</span></td>
//                   </tr>
//                   <tr>
//                     <th style="font-weight: bold;"><span>Amount Due</span></th>
//                     <td style="font-weight: bold;"><span>GHS ${grandTotal}</span></td>
//                   </tr>
//                 </table>
//               </div>

//             </div>
//               <table class="inventory">
//                 <thead>
//                   <tr style="background-color: #374151; display: flex; flex-direction: row;">
//                     <th style="color: #fff; flex: 3; text-align: start; padding-left: 0.6rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem">Item Description</h5></th>
//                     <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.6rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem">Price</h5></th>
//                     <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.6rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem">Qty</h5></th>
//                     <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.6rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem">Amount</h5></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${rows}
//                 </tbody>
//               </table>
//               <table class="balance">
//                 <tr>
//                   <th><span>Subtotal</span></th>
//                   <td><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
//                     'en-US',
//                     { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//                   ).format(
//                     Number(subTotal) - Number(taxInclusiveTotal),
//                   )}</span></td>
//                 </tr>
//                 ${
//                   items && items.delivery
//                     ? `<tr>
//                   <th><span>Delivery</span></th>
//                   <td><span data-prefix>GHS </span><span>${items.delivery.price}</span></td>
//                 </tr>`
//                     : ''
//                 }
//                 ${
//                   items && items.discount
//                     ? `<tr>
//                   <th><span>Discount</span></th>
//                   <td><span data-prefix>-GHS </span><span>${items.discount.discount}</span></td>
//                 </tr>`
//                     : ''
//                 }
//                 ${taxesRows}
//                 <tr>
//                   <th style="font-weight: bold"><span>Total</span></th>
//                   <td style="font-weight: bold"><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
//                     'en-US',
//                     { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//                   ).format(grandTotal)}</span></td>
//                 </tr>

//               </table>

//             </article>
//               <div style="width: 32%; margin-left: auto; margin-right: 1.5rem">
//                 <a class="anchor-button" href="${
//                   (data && data.invoice_url) || ''
//                 }">Pay Invoice</a>
//               </div>
//             <aside>
//               <h1><span>Notes/Terms</span></h1>
//               <div>
//                 <p>${notes}</p>
//               </div>
//             </aside>

//           </body>
//         </html>
//       `;
//   return htmlContent;
// };

//   const {
//     cart,
//     customer,
//     merchantDetails,
//     invoiceNumber,
//     invoiceDate,
//     dueDate,
//     notes,
//     user,
//     subTotal,
//     grandTotal,
//     taxInclusiveTotal,
//     taxes,
//   } = items;
//   const imgUrl =
//     (merchantDetails &&
//       merchantDetails.merchant_brand_logo.length > 0 &&
//       'https://payments.ipaygh.com/app/webroot/img/logo/' +
//         merchantDetails.merchant_brand_logo) ||
//     user.user_merchant_logo;

//   let rows = '';
//   cart.forEach(product => {
//     const itemDesc = `<td style="flex: 3; text-align: start; padding-left: 0.8rem;"><span>${product.itemName}</span></td>`;
//     const price = `<td style="flex: 1; text-align: start; padding-left: 0.8rem;"><span>${new Intl.NumberFormat(
//       'en-US',
//       { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//     ).format(Number(product.amount))}</span></td>`;
//     const qty = `<td style="flex: 1; text-align: start; padding-left: 0.8rem;"><span>${product.quantity}</span></td>`;
//     const amount = `<td style="flex: 1; text-align: start; padding-left: 0.8rem;"><span>${new Intl.NumberFormat(
//       'en-US',
//       { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//     ).format(Number(product.amount) * Number(product.quantity))}</span></td>`;
//     const row =
//       '<tr style="display: flex; flex-direction: row; border-bottom: 0.1px solid #ddd; padding-top: 0.5rem; padding-bottom: 0.5rem">' +
//       itemDesc +
//       price +
//       qty +
//       amount +
//       '</tr>';
//     rows += row;
//   });

//   let taxesRows = '';
//   (taxes || []).forEach(tax => {
//     if (tax) {
//       const head = `<th><span>${tax.taxName} (${tax.taxPercent * 100}%) ${
//         tax.appliedAs === 'INCLUSIVE' ? 'Incl' : 'Excl'
//       }</span></th>`;
//       const value = `<td><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
//         'en-US',
//         { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//       ).format(Number(tax.amount))}</span></td>`;
//       const row = `<tr>${head + value}</tr>`;
//       taxesRows += row;
//     }
//   });

//   const htmlContent = `
//         <html>
//           <head>
//             <meta charset="utf-8">
//             <title style="margin-left: auto">Invoice</title>
//             <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
//             <style>
//               ${htmlStyles}
//             </style>
//           </head>
//           <body>
//             <header>
//               <div>
//                 <h1 style="text-align: center; background: #fff; color: #30475e">Invoice</h1>
//                 <address>
//                   <h1 style="text-align: start; background: #fff; color: #30475e">${
//                     merchantDetails && merchantDetails.merchant_name
//                   }</h1>
//                   <p>Tin: ${
//                     merchantDetails && merchantDetails.merchant_reg_number
//                   }</p>
//                   <p>${merchantDetails && merchantDetails.merchant_address}</p>
//                   <p>Tel: ${
//                     merchantDetails && merchantDetails.merchant_phone
//                   }</p>
//                   <p>Email: ${
//                     merchantDetails && merchantDetails.merchant_email
//                   }</p>
//                 </address>
//               </div>
//               <img src="${imgUrl}" alt="HTML5 Icon" width="128" height="128">
//             </header>
//             <article>
//             <div>
//               <div >
//                 <h3 style="text-align: start; background: #fff; color: #30475e">Bill To:</h3>
//                 <div style="margin-top:0.6rem" />
//                 <address>
//                   <p>${customer && customer.name}</p>
//                   <div style="margin-top:0.3rem" />
//                   <p>${customer && customer.email}</p>
//                   <div style="margin-top:0.3rem" />
//                   <p>${customer && customer.phone}</p>
//                 </address>
//                 <table class="meta" style="margin-bottom: 0.6rem">
//                   <tr>
//                     <th><span>Invoice Date</span></th>
//                     <td><span>${moment(invoiceDate).format(
//                       'DD-MMM-YYYY',
//                     )}</span></td>
//                   </tr>
//                   <tr>
//                     <th><span>Invoice Number</span></th>
//                     <td><span>${invoiceNumber}</span></td>
//                   </tr>
//                   <tr>
//                     <th><span>Due Date</span></th>
//                     <td><span>${moment(dueDate).format(
//                       'DD-MMM-YYYY',
//                     )}</span></td>
//                   </tr>
//                   <tr>
//                     <th style="font-weight: bold;"><span>Amount Due</span></th>
//                     <td style="font-weight: bold;"><span>GHS ${grandTotal}</span></td>
//                   </tr>
//                 </table>
//               </div>

//             </div>
//               <table class="inventory">
//                 <thead>
//                   <tr style="background-color: #374151; padding-top: 0.6rem; padding-bottom: 0.6rem; display: flex; flex-direction: row">
//                     <th style="color: #fff; flex: 3; text-align: start; padding-left: 0.6rem;"><h5>Item Description</h5></th>
//                     <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.6rem;"><h5>Price</h5></th>
//                     <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.6rem;"><h5>Qty</h5></th>
//                     <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.6rem;"><h5>Amount</h5></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${rows}
//                 </tbody>
//               </table>
//               <table class="balance">
//                 <tr>
//                   <th><span>Subtotal</span></th>
//                   <td><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
//                     'en-US',
//                     { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//                   ).format(subTotal - taxInclusiveTotal)}</span></td>
//                 </tr>
//                 ${
//                   items && items.delivery
//                     ? `<tr>
//                   <th><span>Delivery</span></th>
//                   <td><span data-prefix>GHS </span><span>${items.delivery.price}</span></td>
//                 </tr>`
//                     : ''
//                 }
//                 ${
//                   items && items.discount
//                     ? `<tr>
//                   <th><span>Discount</span></th>
//                   <td><span data-prefix>-GHS </span><span>${items.discount.discount}</span></td>
//                 </tr>`
//                     : ''
//                 }
//                 ${taxesRows}
//                 <tr>
//                   <th style="font-weight: bold"><span>Total</span></th>
//                   <td style="font-weight: bold"><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
//                     'en-US',
//                     { maximumFractionDigits: 2, minimumFractionDigits: 2 },
//                   ).format(grandTotal)}</span></td>
//                 </tr>
//               </table>
//             </article>
//             <aside>
//               <h1><span>Notes/Terms</span></h1>
//               <div>
//                 <p>${notes}</p>
//               </div>
//             </aside>

//           </body>
//         </html>
//       `;
//   return htmlContent;
// };

export const invoiceShareHtml = (items, data, receiptItem, isEstimate) => {
  const {
    cart,
    customer,
    merchantDetails,
    invoiceNumber,
    invoiceDate,
    dueDate,
    notes,
    user,
    subTotal,
    grandTotal,
    taxes,
  } = items;
  const imgUrl =
    (merchantDetails &&
      merchantDetails.merchant_brand_logo.length > 0 &&
      'https://payments.ipaygh.com/app/webroot/img/logo/' +
        merchantDetails?.merchant_brand_logo) ||
    user?.user_merchant_logo;

  let rows = '';
  cart.forEach(product => {
    const itemDesc = `<td style="flex: 3; text-align: start; padding-left: 0.8rem; font-family: sans-serif"><span style="color: #30475e">${
      product.itemName
    } ${
      product && product.order_item_props
        ? `<span style="font-size: 0.8rem; font-family: sans-serif">(${Object.values(
            product.order_item_props,
          )
            .toString()
            .replaceAll(',', ', ')})</span>`
        : ''
    }</span></td>`;
    const price = `<td style="flex: 1; text-align: start; padding-left:1.4rem; font-family: sans-serif"><span style="color: #30475e">${new Intl.NumberFormat(
      'en-US',
      { maximumFractionDigits: 2, minimumFractionDigits: 2 },
    ).format(Number(product.amount))}</span></td>`;
    const qty = `<td style="flex: 1; text-align: start; padding-left: 0.8rem; font-family: sans-serif"><span style="color: #30475e">${product.quantity}</span></td>`;
    const amount = `<td style="flex: 1; text-align: start; padding-left: 0.8rem; font-family: sans-serif"><span style="color: #30475e">${new Intl.NumberFormat(
      'en-US',
      { maximumFractionDigits: 2, minimumFractionDigits: 2 },
    ).format(Number(product.amount) * Number(product.quantity))}</span></td>`;
    const row =
      '<tr style="display: flex; flex-direction: row; border-bottom: 0.1px solid #ddd; padding-top: 0.5rem; padding-bottom: 0.5rem">' +
      itemDesc +
      price +
      qty +
      amount +
      '</tr>';
    rows += row;
  });

  let inclusiveTaxRow = '';
  (taxes || []).forEach(tax => {
    if (tax?.appliedAs === 'INCLUSIVE') {
      const head = `<th style="text-align: end; font-weight: 400; font-family: sans-serif"><span>${
        tax.taxName
      } (${tax.taxPercent * 100}%) ${
        tax.appliedAs === 'INCLUSIVE' ? 'Incl' : 'Excl'
      }</span></th>`;
      const value = `<td style="font-weight: 400; font-family: sans-serif"><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
        'en-US',
        { maximumFractionDigits: 2, minimumFractionDigits: 2 },
      ).format(Number(tax.amount))}</span></td>`;
      const row = `<tr>${head + value}</tr>`;
      inclusiveTaxRow += row;
    }
  });

  let exclusiveTaxRow = '';
  (taxes || []).forEach(tax => {
    if (tax?.appliedAs === 'EXCLUSIVE') {
      const head = `<th style="text-align: end; font-weight: 400; font-family: sans-serif"><span>${
        tax.taxName
      } (${tax.taxPercent * 100}%) ${
        tax.appliedAs === 'INCLUSIVE' ? 'Incl' : 'Excl'
      }</span></th>`;
      const value = `<td style="font-weight: 400; font-family: sans-serif"><span data-prefix>GHS </span><span>${new Intl.NumberFormat(
        'en-US',
        { maximumFractionDigits: 2, minimumFractionDigits: 2 },
      ).format(Number(tax.amount))}</span></td>`;
      const row = `<tr>${head + value}</tr>`;
      exclusiveTaxRow += row;
    }
  });

  const htmlContent = `
        <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Replit</title>
     
  </head>
  <style>
  @media print { * { -webkit-print-color-adjust: exact !important; } }
    .address-text {
      font: 0.9rem sans-serif;
      color: #30475e;
      margin: 8px;
      margin-left: 0;
    }
    .merchant-name {
      font: bold 0.8rem Verdana;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: #30475e;
      text-transform: uppercase;
    }
    .image-wrapper {
      margin-left: auto;
    }
    .bill-to {
      font: 0.8rem Verdana;
      color: #30475e;
      font-weight: 800;
      margin: 5px 0px 5px;
    }
    .head-text {
      color: #fff;
      flex: 1;
      text-align: start;
      padding-left: 0.6rem;
      font-family: Verdana;
    }
    table.meta,
    table.balance {
      float: right;
      width: 36%;
      margin-top: 0rem;
    }
    table.meta:after,
    table.balance:after {
      clear: both;
      content: '';
      display: table;
    }

    /* table meta */

    table.meta th {
      width: 40%;
    }
    table.meta td {
      width: 60%;
    }

    /* table items */

    table.inventory {
      clear: both;
      width: 100%;
      margin-top: 1rem;
    }
    table.inventory th {
      font-weight: bold;
      text-align: center;
    }

    table.inventory td:nth-child(1) {
      width: 26%;
    }
    table.inventory td:nth-child(2) {
      width: 38%;
    }
    table.inventory td:nth-child(3) {
      text-align: right;
      width: 12%;
    }
    table.inventory td:nth-child(4) {
      text-align: right;
      width: 12%;
    }
    table.inventory td:nth-child(5) {
      text-align: right;
      width: 12%;
    }
    aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
    aside h1 { border-color: #999; border-bottom-style: solid; }

    /* table balance */

    table.balance th, table.balance td { width: 50%; }
    table.balance td { text-align: right; }
    table.meta, table.balance { float: right; width: 36%; margin-top: 0.5rem }
    table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

    .corner-ribbon{
    width: 200px;
    background: #e43;
    position: absolute;
    top: 25px;
    left: -50px;
    text-align: center;
    line-height: 50px;
    letter-spacing: 1px;
    color: #f0f0f0;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }

.corner-ribbon.sticky{
  position: absolute;
}

.corner-ribbon.shadow{
  box-shadow: 0 0 3px rgba(0,0,0,.3);
}

.corner-ribbon.top-right{
  top: 25px;
  right: -50px;
  left: auto;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.anchor-button {
    display: block;
    width: 100%;
    height: 25px;
    background: #32CB63;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    line-height: 25px;
    margin-top: 15px;
    margin-left: auto;

}
#qrcode {
  width:160px;
  height:160px;
  margin-top:15px;
}

  </style>
  <body>
    <header>
     ${
       data?.invoice || isEstimate
         ? '<div style="background: rgba(176, 71, 89, 0.15)" class="corner-ribbon top-right sticky"><h3 style="color: rgba(176, 71, 89, 1); font-weight: bold; font-size: 1.2rem; margin: 0; font-family: sans-serif">UNPAID</h3></div>'
         : '<div style="background: rgba(26, 172, 172, 0.15)" class="corner-ribbon top-right sticky"><h3 style="color: rgba(26, 172, 172, 1); font-weight: bold; font-size: 1.2rem; font-family: sans-serif">PAID</h3></div>'
     }
    </header>
    <main style="padding-left: 0.8rem; padding-right: 0.8rem"> 
      <h1
        style="
          font: bold 100% Verdana;
          letter-spacing: 0.8em;
          text-transform: uppercase;
          color: #30475e;
          text-align: center;
          margin-top: 2rem
        "
      >
        ${isEstimate ? 'ESTIMATE' : 'INVOICE'}
      </h1>
      <div style="display: flex; flex-direction: row; align-items: center">
       <div>
          <h3 class="merchant-name">${
            merchantDetails && merchantDetails.merchant_name
          }</h3>
          ${
            receiptItem?.receipt_show_tin === 'YES'
              ? `<p class="address-text">Tin: ${
                  merchantDetails && merchantDetails.merchant_reg_number
                }</p>`
              : ''
          }
         ${
           receiptItem?.receipt_show_address === 'YES'
             ? `<p class="address-text">
            ${merchantDetails && merchantDetails.merchant_address}
          </p>`
             : ''
         }
          ${
            receiptItem?.receipt_show_phone === 'YES'
              ? `<p class="address-text">Tel: ${
                  merchantDetails && merchantDetails.merchant_phone
                }</p>`
              : ''
          }
          ${
            receiptItem?.receipt_show_email === 'YES'
              ? `<p class="address-text">Email: ${
                  merchantDetails && merchantDetails.merchant_email
                }</p>`
              : ''
          }
        </div>
         ${
           receiptItem?.receipt_show_logo === 'YES'
             ? `<div class="image-wrapper">
            <img src="${imgUrl}" alt="HTML5 Icon" width="84" height="84" style="margin-right: 2rem" />
          </div>`
             : ''
         }
      </div>
      <div
        style="
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          margin-top: 1.5rem;
        "
      >
        ${
          receiptItem?.receipt_show_customer === 'YES'
            ? `<div>
          <h3 class="bill-to">Bill To:</h3>
          <p class="address-text">${customer && customer.name}</p>
          <p class="address-text">${customer && customer.email}</p>
          <p class="address-text">${customer && customer.phone}</p>
        </div>`
            : ''
        }
        <div style="margin-left: auto">
          <h3 class="address-text" style="text-align: end; font-size: 1.0rem">
            ${
              isEstimate ? 'Estimate' : 'Invoice'
            }  Number: &nbsp #${invoiceNumber}
          </h3>
          <p class="address-text" style="text-align: end; font-size: 1.0rem">
            Order No: &nbsp${data?.order_no || ''}
          </p>
          <p class="address-text" style="text-align: end; font-size: 1.0rem">
            Transaction ID: &nbsp${data?.invoice || ''}
          </p>
          <p class="address-text" style="text-align: end; font-size: 1.0rem">
            Invoice Date: &nbsp ${moment(invoiceDate).format('MMM DD, YYYY')}
          </p>
          <p class="address-text" style="text-align: end; font-size: 1.0rem">
            Due Date: &nbsp ${moment(dueDate).format('MMM DD, YYYY')}
          </p>
          
        </div>
      </div>
      </div>
      <table class="inventory">
        <thead>
          <tr
            style="
              background-color: #374151;
              display: flex;
              flex-direction: row;
            "
          >
           <tr style="background-color: #374151; display: flex; flex-direction: row;">
               <th style="color: #fff; flex: 3; text-align: start; padding-left: 0.6rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem; font-family: sans-serif">Item Description</h5></th>
                <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.0rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem; font-family: sans-serif">Price</h5></th>
              <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.0rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem; font-family: sans-serif">Qty</h5></th>
                <th style="color: #fff; flex: 1; text-align: start; padding-left: 0.0rem;"><h5 style="margin-top: 0.6rem; margin-bottom: 0.6rem; font-family: sans-serif">Amount</h5></th>
          </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
      </table>
      <div style="display: flex; flex-direction: column">
          <table class="balance" style="margin-top: 1rem; margin-left: auto;">
            <tr>
              <th style="text-align: end; font-weight: 400"><span style="color: #30475e; font-family: sans-serif">Subtotal</span></th>
              <td font-weight: 400><span data-prefix style="color: #30475e; font-family: sans-serif">GHS </span><span style="color: #30475e; font-family: sans-serif">${new Intl.NumberFormat(
                'en-US',
                { maximumFractionDigits: 2, minimumFractionDigits: 2 },
              ).format(Number(subTotal))}</span></td>
            </tr>
            ${
              items && items.discount
                ? `<tr>
              <th style="text-align: end"><span style="color: #30475e; font-weight: 400; font-family: sans-serif">Discount</span></th>
              <td><span data-prefix style="font-weight: 400; color: #30475e; font-family: sans-serif">-GHS </span><span style="color: #30475e; font-family: sans-serif">${items.discount.discount}</span></td>
            </tr>`
                : ''
            }
            ${exclusiveTaxRow}
            ${
              items && items.delivery
                ? `<tr style="text-align: end">
              <th><span style="color: #30475e; font-weight: 400; font-family: sans-serif">Delivery</span></th>
              <td><span data-prefix style="color: #30475e ; font-weight: 400; font-family: sans-serif">GHS </span><span style="color: #30475e; font-family: sans-serif">${items.delivery.price}</span></td>
            </tr>`
                : ''
            }
            
            <tr>
              <th style="text-align: end;"><span style="color: #30475e; font-weight: normal; font-family: sans-serif">Total</span></th>
              <td ><span data-prefix style="color: #30475e; font-family: sans-serif">GHS </span><span style="color: #30475e; font-family: sans-serif">${new Intl.NumberFormat(
                'en-US',
                { maximumFractionDigits: 2, minimumFractionDigits: 2 },
              ).format(grandTotal)}</span></td>
            </tr>  
            <tr>
              <th style="font-weight: bold; text-align: end"><span style="color: #4B56D2; font-family: sans-serif">Amount Due</span></th>
              <td style="font-weight: bold"><span data-prefix style="color: #4B56D2; font-family: sans-serif">GHS </span><span style="color: #4B56D2; font-family: sans-serif">${new Intl.NumberFormat(
                'en-US',
                { maximumFractionDigits: 2, minimumFractionDigits: 2 },
              ).format(grandTotal)}</span></td>
            </tr>   
            ${inclusiveTaxRow}
      </table>
       
      <aside style="margin-top: 1rem">
        <h1 class="merchant-name"><span>Notes/Terms</span></h1>
        <div>
          <p style="color: #30475e; font-family: sans-serif">${notes || ''}</p>
        </div>
      </aside>
      </div>
      ${
        data?.invoice_url?.length > 0
          ? `<div style="display: flex; align-items: center;  margin-top: 1rem; flex-direction: column;">
        <img src="${` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
          data?.invoice_url || ''
        }`}" alt="HTML5 Icon" width="100" height="100" style="align-self: auto" />
        <p style="color: #192655; font-family: sans-serif; margin: 0; margin-top: 15;" >SCAN TO PAY</p>
        <h1 style="color: #192655; font-family: sans-serif; margin: 0; margin-top: 2; font-size: 16">OR</h1>
        <div style="width: 15rem; display: flex; margin-right: 14px ">
                <a style="text-decoration: none; font-family: sans-serif" class="anchor-button" href="${
                  data?.invoice_url || ''
                }">CLICK TO PAY</a>
      </div>`
          : ''
      }
      ${
        !isEstimate
          ? '<img style="height: 6rem;  " src="https://payments.ipaygh.com/app/webroot/img/logo/DSPayments.png" />'
          : ''
      }
      </div>

    </main>
     <footer style="margin-top: auto;  position: absolute; bottom: 12px; width: 100%;  border-top: 1px solid #aaa">
        <p style="font-size: 1.1rem; font-family: Sans-serif; text-align: center;
         margin-left: 2rem; "> ${
           isEstimate ? 'Estimate ' : 'Invoice '
         }created using Digistore Business Manager <img style="height: 22;  margin-left: 12px" src="https://payments.ipaygh.com/app/webroot/img/logo/DSBMLogo.jpg" />
          </p>
          <p style="padding-top: 0; margin-top: 0; font-size: 1.1rem; font-family: Sans-serif; text-align: center; margin-left: 2rem">Download the App or Visit <a style="color: blue" href="https://digistoreafrica.com">www.digistoreafrica.com</a> to sign up and create professional invoices</p>
    </footer>
  </body>
</html>
      `;
  return htmlContent;
};
