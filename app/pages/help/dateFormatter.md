## Date formatting

For line charts or other chart types that commonly represent changing values over time, you'll need to tell Simplechart how to interpret dates within your data. Note that dates are expected as the _first_ column of the CSV data, and all dates must be provided in the _same format_.

The date format uses formatting tokens to replace the variable portions of the dates. Some examples:

<table>
<thead>
<tr>
<th>CSV input</th>
<th>Date format</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>
Date, ...
06/25/2014, ...
06/26/2014, ...
</pre>
</td>
<td><code>MM/DD/YYYY</code></td>
</tr>
<tr>
<td>
<pre>
Date, ...
06-25-2014, ...
06-26-2014, ...
</pre>
</td>
<td><code>MM-DD-YYYY</code></td>
</tr>
<tr>
<td>
<pre>
Date, ...
25/06/2014, ...
26/06/2014, ...
</pre>
</td>
<td><code>DD/MM/YYYY</code></td>
</tr>
<tr>
<td>
<pre>
Date, ...
20140625, ...
20140626, ...
</pre>
</td>
<td><code>YYYYMMDD</code></td>
</tr>
<tr>
<td>
<pre>
Date, ...
June 25\, 2014, ...
June 26\, 2014, ...
</pre>
</td>
<td><code>MMM D, YYYY</code><p>Note: Using commas in date inputs is <em>NOT</em> recommended!</p></td>
</tr>
<tr>
<td>
<pre>
Date, ...
Wed Jun 25 2014 18:00:00, ...
Thu Jun 26 2014 18:00:00, ...
</pre>
</td>
<td><code>ddd MMM DD YYYY HH:mm:ss</code></td>
</tr>
</tbody>
</table>

Here is the complete set of formatting tokens:

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <th></th>
      <th>Token</th>
      <th>Output</th>
    </tr>
    <tr>
      <td><b>Month</b></td>
      <td>M</td>
      <td>1 2 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>MM</td>
      <td>01 02 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>MMM</td>
      <td>Jan Feb ... Nov Dec</td>
    </tr>
    <tr>
      <td></td>
      <td>MMMM</td>
      <td>January February ... November December</td>
    </tr>
    <tr>
      <td><b>Day of Month</b></td>
      <td>D</td>
      <td>1 2 ... 30 31</td>
    </tr>
    <tr>
      <td></td>
      <td>Do</td>
      <td>1st 2nd ... 30th 31st</td>
    </tr>
    <tr>
      <td></td>
      <td>DD</td>
      <td>01 02 ... 30 31</td>
    </tr>
    <tr>
      <td><b>Day of Week</b></td>
      <td>d</td>
      <td>0 1 ... 5 6</td>
    </tr>
    <tr>
      <td></td>
      <td>ddd</td>
      <td>Sun Mon ... Fri Sat</td>
    </tr>
    <tr>
      <td></td>
      <td>dddd</td>
      <td>Sunday Monday ... Friday Saturday</td>
    </tr>
    <tr>
      <td><b>Year</b></td>
      <td>YY</td>
      <td>70 71 ... 29 30</td>
    </tr>
    <tr>
      <td></td>
      <td>YYYY</td>
      <td>1970 1971 ... 2029 2030</td>
    </tr>
    <tr>
      <td><b>AM/PM</b></td>
      <td>A</td>
      <td>AM PM</td>
    </tr>
    <tr>
      <td></td>
      <td>a</td>
      <td>am pm</td>
    </tr>
    <tr>
      <td><b>Hour</b></td>
      <td>H</td>
      <td>0 1 ... 22 23</td>
    </tr>
    <tr>
      <td></td>
      <td>HH</td>
      <td>00 01 ... 22 23</td>
    </tr>
    <tr>
      <td></td>
      <td>h</td>
      <td>1 2 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>hh</td>
      <td>01 02 ... 11 12</td>
    </tr>
    <tr>
      <td><b>Minute</b></td>
      <td>m</td>
      <td>0 1 ... 58 59</td>
    </tr>
    <tr>
      <td></td>
      <td>mm</td>
      <td>00 01 ... 58 59</td>
    </tr>
    <tr>
      <td><b>Second</b></td>
      <td>s</td>
      <td>0 1 ... 58 59</td>
    </tr>
    <tr>
      <td></td>
      <td>ss</td>
      <td>00 01 ... 58 59</td>
    </tr>
    <tr>
      <td><b>Fractional Second</b></td>
      <td>S</td>
      <td>0 1 ... 8 9</td>
    </tr>
    <tr>
      <td></td>
      <td>SS</td>
      <td>0 1 ... 98 99</td>
    </tr>
    <tr>
      <td></td>
      <td>SSS</td>
      <td>0 1 ... 998 999</td>
    </tr>
    <tr>
      <td><b>Timezone</b></td>
      <td>ZZ</td>
      <td>
        -0700 -0600 ... +0600 +0700
      </td>
    </tr>
  </tbody>
</table>
