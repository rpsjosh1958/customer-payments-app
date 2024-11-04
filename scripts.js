// scripts run after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchPayments();

    const modal = document.getElementById("payment-modal");         // get the modal element
    const closeButton = document.querySelector(".close-button");    // get the close button

    closeButton.onclick = () => {                                   // Close the modal element when the close button is clicked
        modal.style.display = "none";
    };

    window.onclick = (event) => {                                  // closes the modal element if the user clicks outside of it
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    document.getElementById('payment-date-header').addEventListener('click', sortTableByDate);   // an event listener to sort the table by date when the date header is clicked
    document.getElementById('filter-button').addEventListener('click', fetchPayments);          // an event listener to filter and fetch payments when the filter button is clicked
});

function fetchPayments() {    // making a GET request using the fetch function to retrieve payment data from the API with start and date parameters
    const startDate = document.getElementById('start-date').value || '2024-01-01';  //adding the StartDate and EndDate for the query parameters the API endpoint accepts
    const endDate = document.getElementById('end-date').value || new Date().toISOString().split('T')[0];

    // using the fetch function to retrieve payment data from the API with the StartDate and EndDate query parameters
    // `https://cors-anywhere.herokuapp.com/" is being used to bypass the CORS issue faced when trying to retrieve payment data from API
    fetch(`https://cors-anywhere.herokuapp.com/https://spes.pscgh.com:442/sales-api/api/Payments?StartDate=${startDate}&EndDate=${endDate}`)
        .then(response => response.json())    //to parse the response an JSON 
        .then(data => {
            const tableBody = document.querySelector('#payments-table tbody');
            tableBody.innerHTML = '';  // clear existing rows in the table

            data.forEach(payment => {   
                const row = document.createElement('tr');     // create a row for the table
                row.innerHTML = `  
                    <td>${payment.PaymentId}</td>          
                    <td>${payment.PaymentNumber}</td>
                    <td>${payment.CustomerId}</td>
                    <td>${payment.Customer}</td>
                    <td>${payment.Amount}</td>
                    <td>${new Date(payment.PaymentDate).toLocaleDateString()}</td>
                    <td><button onClick="viewPayment('${payment.PaymentId}')">View</button></td>
                `;  // the string literals embedded in the <td> tags fills the rows with payment data
                tableBody.appendChild(row);    // appends row to table body
            });
        })
        .catch(error => console.error('Error fetching payment data:', error));    // logs errors into console
}

function sortTableByDate() {
    const table = document.getElementById('payments-table');   // get the table element by its ID
    const rows = Array.from(table.rows).slice(1);  // removes first row which is the header row
    rows.sort((a, b) => new Date(a.cells[3].innerText) - new Date(b.cells[3].innerText)); // Sort the rows based on the date in the "Payment Date" column in ascending order

    rows.forEach(row => table.appendChild(row)); // appends rows back to the table in the ascended order
}

function viewPayment(paymentId) {    // // function to view payment details in a modal window
    fetch(`https://cors-anywhere.herokuapp.com/https://spes.pscgh.com:442/sales-api/api/Payments/${paymentId}`)  // using the fetch function to retrieve detailed information for a specific payment by its ID from API
        .then(response => response.json())
        .then(payment => {
            const modal = document.getElementById("payment-modal");
            const paymentDetails = document.getElementById("payment-details");

            // fills the modal with detailed payment information using the sample payload strings provided
            paymentDetails.innerHTML = `
                <h3>Payment Details</h3>
                <p>Id: ${payment.Id}</p>
                <p>Payment Number: ${payment.PaymentNumber}</p>
                <p>Amount Paid: ${payment.AmountPaid}</p>
                <p>Outstanding: ${payment.Outstanding}</p>
                <p>Payment Date: ${new Date(payment.PaymentDate).toLocaleDateString()}</p>
                <p>CustomerId: ${payment.CustomerId}</p>
                <p>UserId: ${payment.UserId}</p>
                <p>Customer: ${payment.Customer}</p>
                <p>Remarks: ${payment.Remarks}</p>
                <p>onAccount: ${payment.onAccount}</p>
                <p>CreatedAt: ${new Date(payment.CreatedAt).toLocaleDateString()}</p>
                <p>Status: ${payment.Status}</p>
                <h3>Mode of Payments</h3>
                ${payment.ModeOfPayments.map(paymentMode => `
                    <p>Mode Of Payment: ${paymentMode.ModeOfPayment}</p>
                    <p>Amount: ${paymentMode.Amount}</p>
                    <p>AccountId: ${paymentMode.AccountId}</p>
                    <p>BankId: ${paymentMode.BankId}</p>
                    <p>Account: ${paymentMode.Account}</p>
                    <p>Bank: ${paymentMode.Bank}</p>
                    <p>Reference: ${paymentMode.Reference}</p>
                `).join('')}
                <h3>Invoices</h3>
                ${payment.invoices.map(invoice => `
                    <p>Id: ${invoice.Id}</p> <!-- Added Id -->
                    <p>Invoice Number: ${invoice.InvoiceNumber}</p>
                    <p>Total Amount: ${invoice.TotalAmount}</p>
                    <p>Outstanding: ${invoice.Outstanding}</p>
                    <p>Invoice Date: ${new Date(invoice.InvoiceDate).toLocaleDateString()}</p>
                    <p>Invoice Status: ${invoice.InvoiceStatus}</p>
                `).join('')}
                <h3>Payee Details</h3>
                <p>Full Name: ${payment.Payee.FullName}</p>
                <p>Phone: ${payment.Payee.Phone}</p>
                <p>Email: ${payment.Payee.Email}</p>
                <p>Address: ${payment.Payee.Address}</p>
            `;
            modal.style.display = "block"; // shows the modal element
        })
        .catch(error => console.error('Error fetching payment details:', error));  // logs errors into console
}
