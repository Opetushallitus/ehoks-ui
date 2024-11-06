import styled from "styled"

/**
 * Responsive wrapper for three column tables
 */
export const InfoTable = styled("table")`
  table-layout: fixed;
  width: 100%;

  th {
    font-weight: 400;
    color: #6e6e7e;
    text-align: left;
  }

  td {
    padding: 0 10px 10px 0;
    word-break: break-word;
  }

  th,
  td {
    line-height: 150%;
  }

  tr:first-child {
    th {
      width: 33%;
    }
  }

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    width: 100%;

    tr {
      display: block;
    }

    th {
      display: none;
    }

    td {
      display: block;
      padding-left: 40px;

      &:before {
        content: attr(data-label);
        color: #6e6e7e;
        display: block;
      }
    }
  }
`
