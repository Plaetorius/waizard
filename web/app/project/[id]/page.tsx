import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Heart, Send, Users, Mail, ArrowLeft, CheckCircle2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getProjectById } from "./actions"
import { Suspense } from "react"

// Add a ProjectContent component to handle the async data fetching
async function ProjectContent({ id }: { id: string }) {
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  const progressPercentage = Math.round((project.collectedElements / project.requiredElements) * 100)
  const distributedPercentage = Math.round((project.distributedPrizePool / project.totalPrizePool) * 100)

  return (
    <>
      <div className="lg:col-span-2 space-y-8">
        <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden">
          <Image
            src={project.imageUrl || "/placeholder.svg?height=800&width=1200"}
            alt={project.name}
            fill
            className="object-cover"
            unoptimized={project.imageUrl?.startsWith("http")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl md:text-3xl font-bold">{project.name}</h1>
            <p className="text-lg text-muted-foreground">{project.organizationName}</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          <p className="text-muted-foreground mb-6">{project.description || "No description provided."}</p>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Data Types</h3>
              <div className="flex flex-wrap gap-2">
                {project.dataTypes.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Team</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {project.adminAddresses.length} Admins, {project.validatorAddresses.length} Validators
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Project Progress</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Data Collection</span>
                <span className="text-sm font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{project.collectedElements.toLocaleString()} collected</span>
                <span>{project.requiredElements.toLocaleString()} required</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Prize Distribution</span>
                <span className="text-sm font-medium">{distributedPercentage}%</span>
              </div>
              <Progress value={distributedPercentage} className="h-2.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${project.distributedPrizePool.toLocaleString()} distributed</span>
                <span>${project.totalPrizePool.toLocaleString()} total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card rounded-xl p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-6">Project Actions</h2>

          <div className="space-y-4">
            <Button className="w-full" variant="default" asChild>
              <Link href={`/project/${project.id}/contribute`}>
                <Send className="mr-2 h-4 w-4" />
                Contribute Data
              </Link>
            </Button>

            <Button className="w-full" variant="outline">
              <Heart className="mr-2 h-4 w-4" />
              Follow Project
            </Button>

            <Button className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Contact Team
            </Button>

            <Button className="w-full" variant="outline" asChild>
              <Link href={`/project/${project.id}/validator`}>
                <Check className="mr-2 h-4 w-4" />
                Validator Access
              </Link>
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-border/40">
            <h3 className="text-sm font-medium mb-3">Reward Information</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-quorion-green mt-0.5 shrink-0" />
                <span>
                  Earn up to{" "}
                  <span className="font-medium">${(project.totalPrizePool / project.requiredElements).toFixed(2)}</span>{" "}
                  per valid data submission
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-quorion-green mt-0.5 shrink-0" />
                <span>Payments processed via secure Web3 transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-quorion-green mt-0.5 shrink-0" />
                <span>Additional bonuses for high-quality submissions</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t border-border/40">
            <h3 className="text-sm font-medium mb-3">Contact Information</h3>
            <p className="text-sm text-muted-foreground">
              For questions or support, contact:
              <br />
              <a href={`mailto:${project.contactEmail}`} className="text-quorion-cyan hover:underline">
                {project.contactEmail}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Update the main component to use Suspense
export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8 md:py-12">
      <Link
        href="/projects"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <Suspense fallback={<p className="sr-only">Loading project...</p>}>
          <ProjectContent id={params.id} />
        </Suspense>
      </div>
    </div>
  )
}

