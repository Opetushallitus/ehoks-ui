import styled from "react-emotion"

export interface AvatarImageProps {
  src?: string
}

export const AvatarImage = styled("div")`
  width: 64px;
  height: 64px;
  background-image: url('${(props: AvatarImageProps) => props.src}');
  background-position: center;
  background-size: 50px 50px;
  background-repeat: no-repeat;
`
