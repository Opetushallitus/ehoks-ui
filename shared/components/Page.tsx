import styled from "styled"

interface PageProps {
  active?: boolean
}

interface PageButtonProps {
  disabled?: boolean
}

export const Page = styled("div")`
  display: inline-block;
  background-color: ${(props: PageProps) =>
    props.active ? "#316fa0" : "#F4FFF4"};
  color: ${(props: PageProps) => (props.active ? "#fff" : "#000")};
  padding: 5px 10px;
  margin-right: 10px;
  cursor: ${(props: PageProps) => (props.active ? "default" : "pointer")};
`

export const PageButton = styled("button")`
  display: inline-block;
  background-color: ${(props: PageButtonProps) =>
    props.disabled ? "#f5f9fd" : "#F4FFF4"};
  color: ${(props: PageButtonProps) => (props.disabled ? "#ccc" : "#000")};
  padding: 5px 10px;
  margin-right: 10px;
  cursor: ${(props: PageButtonProps) =>
    props.disabled ? "default" : "pointer"};
  font-size: 14px;
  line-height: 20px;
  border: 0;
`
