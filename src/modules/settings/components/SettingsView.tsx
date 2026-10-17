"use client";

import { useState } from "react";
import {
  Settings,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  ShieldAlert,
  Save,
  RotateCcw,
  Check,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { useGymStore } from "@/context/GymStoreContext";
import { useToast } from "@/context/ToastContext";

export function SettingsView() {
  const { settings, updateSettings, resetAllData } = useGymStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ ...settings });
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast({
      type: "success",
      title: "Settings Saved",
      message: "Facility preferences and operating hours updated.",
    });
  };

  const handleConfirmReset = () => {
    resetAllData();
    showToast({
      type: "info",
      title: "System Restored",
      message: "Reset all demo data back to default template state.",
    });
    setResetModalOpen(false);
  };

  return (
    <Shell>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                Gym System Settings
              </h1>
              <Badge variant="info">Configuration</Badge>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Gym identity, facility operating hours, billing parameters, and data management.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setResetModalOpen(true)}
            className="text-danger hover:bg-danger-subtle gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo Data
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Gym Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Facility Brand & Contact</CardTitle>
              <CardDescription>
                Public club details shown on member invoices and email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Gym Club Name" required>
                  <Input
                    value={formData.gymName}
                    onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                    required
                  />
                </FormField>

                <FormField label="Club Tagline / Slogan">
                  <Input
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                </FormField>

                <FormField label="Official Contact Email" required>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </FormField>

                <FormField label="Customer Support Phone">
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </FormField>
              </div>

              <FormField label="Physical Facility Address">
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Operating Hours & Billing */}
          <Card>
            <CardHeader>
              <CardTitle>Operating Schedule & Currency</CardTitle>
              <CardDescription>
                Turnstile access hours and tax configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Facility Opening Time">
                  <Input
                    value={formData.openingTime}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                  />
                </FormField>

                <FormField label="Facility Closing Time">
                  <Input
                    value={formData.closingTime}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                  />
                </FormField>

                <FormField label="Active Currency">
                  <Select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="USD ($)">USD ($) - United States Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                    <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                    <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                  </Select>
                </FormField>

                <FormField label="Sales / Service Tax Rate (%)">
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.taxRate}
                    onChange={(e) =>
                      setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })
                    }
                  />
                </FormField>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-3 border-t border-border">
                {[
                  {
                    key: "autoRenewals",
                    title: "Automated Membership Renewals",
                    desc: "Notify admin and queue renewal invoices 7 days prior to plan expiration",
                  },
                  {
                    key: "emailAlerts",
                    title: "Email System Notifications",
                    desc: "Send receipts and class confirmation emails to members automatically",
                  },
                  {
                    key: "guestPassEnabled",
                    title: "Allow Guest Check-ins",
                    desc: "Enable reception turnstile to accept complimentary member guest vouchers",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface cursor-pointer hover:bg-surface-secondary"
                  >
                    <div>
                      <p className="font-semibold text-sm text-text-primary">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(formData[item.key as "autoRenewals" | "emailAlerts" | "guestPassEnabled"])}
                      onChange={(e) =>
                        setFormData({ ...formData, [item.key]: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-border-strong text-primary"
                    />
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="solid" type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Save System Settings
            </Button>
          </div>
        </form>
      </div>

      {/* Reset Confirmation Dialog */}
      <Modal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset All Mock Data?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            This will wipe your current local state (members, check-ins, payments, classes) and restore the default gym showcase data.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" className="bg-danger hover:bg-danger/90 border-none" onClick={handleConfirmReset}>
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>
    </Shell>
  );
}

