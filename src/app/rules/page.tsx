'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Users, Drama, Target, Trophy, Lightbulb, Landmark, Eye, Gamepad2 } from 'lucide-react'

export default function RulesPage() {
  const rules = [
    {
      Icon: Users,
      title: 'Setup',
      description: 'Add all players (minimum 3). Each player will have a secret role every round.'
    },
    {
      Icon: Drama,
      title: 'The Roles',
      items: [
        { 
          role: 'Architect', 
          RoleIcon: Landmark,
          color: 'text-brand-secondary', 
          bgColor: 'bg-brand-secondary/10', 
          borderColor: 'border-brand-secondary/20', 
          iconBg: 'bg-brand-secondary/20',
          desc: 'Builds the brand logo using geometric shapes' 
        },
        { 
          role: 'Players', 
          RoleIcon: Eye,
          color: 'text-emerald-600', 
          bgColor: 'bg-emerald-50', 
          borderColor: 'border-emerald-200',
          iconBg: 'bg-emerald-100',
          desc: 'Watch and try to guess the brand' 
        },
        { 
          role: 'Saboteur', 
          RoleIcon: Drama,
          color: 'text-red-500', 
          bgColor: 'bg-red-50', 
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          desc: 'Tries to convince others it\'s a different brand' 
        }
      ]
    },
    {
      Icon: Target,
      title: 'Round Flow',
      steps: [
        'Pass the phone to each player so they can discover their role in secret',
        'The Architect also sees the brand they must build',
        'The Architect builds the logo on the table with game shapes',
        'Players discuss and propose brands',
        'The Saboteur secretly tries to mislead them to a wrong answer',
        'Vote for the final brand!'
      ]
    },
    {
      Icon: Trophy,
      title: 'Win Conditions',
      items: [
        { 
          title: 'Players Win', 
          desc: 'If after the full table round, the saboteur never successfully misled them', 
          color: 'text-emerald-600', 
          bgColor: 'bg-emerald-50', 
          borderColor: 'border-emerald-200' 
        },
        { 
          title: 'Saboteur Wins', 
          desc: 'As soon as they convince players to vote for the wrong brand', 
          color: 'text-red-500', 
          bgColor: 'bg-red-50', 
          borderColor: 'border-red-200' 
        }
      ]
    },
    {
      Icon: Lightbulb,
      title: 'Tips',
      tips: [
        'The Saboteur should be subtle - suggesting similar brands is a good strategy',
        'Players should be wary of overly insistent suggestions',
        'The Architect can help by giving clear visual hints',
        'Be careful not to reveal your role through your behavior!'
      ]
    }
  ]
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-brand-gray 
                       hover:text-brand-secondary transition-colors mb-8 font-body"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Link>
        </motion.div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-2 sm:mb-3">
            How to Play
          </h1>
          <p className="text-brand-gray font-body text-sm sm:text-base">
            Everything you need to know to play BrandArchitect
          </p>
        </motion.div>
        
        {/* Rules */}
        <div className="space-y-6">
          {rules.map((section, index) => {
            const SectionIcon = section.Icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                    <SectionIcon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-brand-dark">
                    {section.title}
                  </h2>
                </div>
                
                {section.description && (
                  <p className="text-brand-dark/70 leading-relaxed font-body">
                    {section.description}
                  </p>
                )}
                
                {section.items && (
                  <div className="space-y-3">
                    {section.items.map((item, i) => {
                      const ItemIcon = 'RoleIcon' in item ? item.RoleIcon : null
                      return (
                        <div 
                          key={i}
                          className={`rounded-2xl p-4 border ${item.bgColor} ${item.borderColor}`}
                        >
                          <div className="flex items-start gap-3">
                            {ItemIcon && 'iconBg' in item && (
                              <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                                <ItemIcon className={`w-5 h-5 ${item.color}`} />
                              </div>
                            )}
                            <div>
                              <h3 className={`font-display font-semibold ${item.color} mb-1`}>
                                {'role' in item ? item.role : item.title}
                              </h3>
                              <p className="text-sm text-brand-dark/60 font-body">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {section.steps && (
                  <ol className="space-y-3">
                    {section.steps.map((step, i) => (
                      <li 
                        key={i}
                        className="flex items-start gap-3"
                      >
                        <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center 
                                         bg-brand-primary text-brand-dark rounded-xl 
                                         font-display font-bold text-sm">
                          {i + 1}
                        </span>
                        <span className="text-brand-dark/70 pt-0.5 font-body">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
                
                {section.tips && (
                  <ul className="space-y-2">
                    {section.tips.map((tip, i) => (
                      <li 
                        key={i}
                        className="flex items-start gap-2 text-brand-dark/70 font-body"
                      >
                        <span className="text-brand-primary font-bold mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )
          })}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Link href="/new-game">
            <motion.button
              className="btn-primary w-full text-lg py-5 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Gamepad2 className="w-5 h-5" />
              Start a Game
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
