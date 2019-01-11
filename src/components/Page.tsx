import styled from "styled"

interface PageProps {
  active?: boolean
}

export const Page = styled("div")`
  display: inline-block;
  background-color: ${(props: PageProps) =>
    props.active ? "#316fa0" : "#ecf3fc"};
  color: ${(props: PageProps) => (props.active ? "#fff" : "#000")};
  padding: 5px 10px;
  margin-right: 10px;
  cursor: ${(props: PageProps) => (props.active ? "default" : "pointer")};
`
