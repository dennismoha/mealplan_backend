import OwnProfessionalProfile from "../components/ProfessionalProfileForm"
import Workspace from "../components/Workspace"

export default function ProfessionalPage() {
  return <Workspace mode="professional" introduction={<OwnProfessionalProfile />} />
}
