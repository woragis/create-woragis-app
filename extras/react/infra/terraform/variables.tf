variable "project_name" {
  description = "Name of the App"
  type        = string
  default     = "__projectName__"
}

variable "project_type" {
  description = "Type of the App"
  type        = string
  default     = "__projectType__"
}

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "__awsRegion__"
}

variable "domain_name" {
  description = "Domain for the React app"
  type        = string
  default     = "__domainName__"
}

variable "subdomain" {
  description = "Subdomain for the React app"
  type        = string
  default     = "__subdomain__"
}

variable "bucket_name" {
  description = "S3 bucket name for the React build"
  type        = string
  default     = "__bucketName__"
}

variable "create_zone" {
  description = "Flag to create Route 53 hosted zone"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags for the resources"
  type        = map(string)
  default     = {}
}
